import React from 'react';

import { View } from '@huds0n/components';
import { LazyList } from '@huds0n/lazy-list';
import { timeout } from '@huds0n/utilities';

import { AnimatedView } from '../Containers';

import { flattenAnimationHx, flattenProp } from './helpers';
import { theming } from './theming';
import * as Types from './types';

export namespace AnimatedLazyList {
  export type Animation = Types.Animation;
  export type Loop = AnimatedView.Loop;

  export type OnAnimationEndFn = Types.OnAnimationEndFn;

  export type AnimatedItemInfo<ItemT = any> = Types.AnimatedItemInfo<ItemT>;
  export type ItemAnimation<ItemT = any> = Types.ItemAnimation<ItemT>;
  export type ItemStartStyle<ItemT = any> = Types.ItemStartStyle<ItemT>;

  export type ListRenderItemInfo<ItemT = any> = Types.ListRenderItemInfo<ItemT>;
  export type ListRenderItem<ItemT = any> = Types.ListRenderItem<ItemT>;

  export type Props<ItemT = any> = Types.LazyListProps<ItemT>;
}

export class AnimatedLazyList<ItemT = any> extends React.PureComponent<
  AnimatedLazyList.Props<ItemT>,
  Types.State<ItemT>
> {
  static theming = theming;

  private _flatListRef: any;

  private _animationHx: AnimatedLazyList.ItemAnimation[];
  private _animationsPending: AnimatedLazyList.ItemAnimation[];

  private _visiblityDetails: null | Types.VisibilityDetails;

  constructor(props: AnimatedLazyList.Props<ItemT>) {
    super(props);

    this.state = {
      currentAnimation: null,
      isAnimating: false,
      ListRef: null,
      reorientating: false,
    };

    this._flatListRef = React.createRef<any>();

    this._animationHx = [];
    this._animationsPending = [];

    this._visiblityDetails = null;

    if (this.props.itemAnimate) {
      this.animate(this.props.itemAnimate);
    }

    this._onContentSizeChange = this._onContentSizeChange.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this.renderItem = this.renderItem.bind(this);

    //
    this._onRefresh = this._onRefresh.bind(this);
  }

  //
  private _getLastElement() {
    const { SharedLazyArray } = this.props;

    return SharedLazyArray.data.length - 1;
  }

  private async _canStartAnimation() {
    const { numColumns = 1, SharedLazyArray } = this.props;
    const { ListRef, isAnimating } = this.state;

    if (
      !ListRef ||
      SharedLazyArray.state.isLoading ||
      !SharedLazyArray.data.length ||
      isAnimating
    ) {
      return false;
    }

    if (SharedLazyArray.state.pageEnd) {
      return true;
    }

    const {
      _frames,
      _scrollMetrics: { offset: scrollOffset, visibleLength },
    } = ListRef;

    while (
      Object.keys(ListRef._frames).length <
      Math.ceil(SharedLazyArray.data.length / numColumns)
    ) {
      await timeout(0);
    }

    const lastFrame = Object.values<Types.Frame>(_frames).sort(
      (a, b) => b.index - a.index,
    )[0];

    if (!lastFrame) {
      return false;
    }

    return lastFrame.offset + lastFrame.length >= scrollOffset + visibleLength;
  }

  componentDidMount() {
    this._handleRef();

    //
    const { SharedLazyArray } = this.props;

    SharedLazyArray.addListener('isLoading', () => {
      this._startNextAnimation();
    });
  }

  componentDidUpdate({
    itemAnimate: prevAnimate,
  }: AnimatedLazyList.Props<ItemT>) {
    const { itemAnimate: newAnimate } = this.props;

    if (newAnimate && newAnimate !== prevAnimate) {
      this.animate(newAnimate);
    }
  }

  animate(animation: AnimatedLazyList.ItemAnimation<ItemT>) {
    this._animationsPending.push(animation);

    this._startNextAnimation();
  }

  private async _handleRef() {
    while (
      this._flatListRef.current?._listRef.props.data?.length !== 0 &&
      !this._flatListRef.current?._listRef._totalCellsMeasured
    ) {
      await timeout(0);
    }

    this.setState(
      {
        ListRef: this._flatListRef.current._listRef,
      },
      () => {
        this._startNextAnimation();
      },
    );
  }

  private _getNextAnimation() {
    const { currentAnimation } = this.state;
    const nextAnimation = this._animationsPending[0];

    if (nextAnimation) {
      currentAnimation && this._animationHx.push(currentAnimation);
      this._animationsPending.shift();

      return nextAnimation;
    }

    return null;
  }

  private async _startNextAnimation() {
    const canStart = await this._canStartAnimation();

    if (canStart) {
      const nextAnimation = this._getNextAnimation();

      if (nextAnimation) {
        this.setState({ currentAnimation: nextAnimation, isAnimating: true });
        return true;
      }
    }
    return false;
  }

  private _getVisiblityDetails() {
    return this._visiblityDetails || this._calculateVisibilityDetails();
  }

  private _calculateVisibilityDetails() {
    const { numColumns = 1 } = this.props;
    const { ListRef } = this.state;

    const {
      _frames,
      _scrollMetrics: { offset: scrollOffset, visibleLength },
    } = ListRef;

    let startIndex = -1;
    let endIndex = -1;

    const frames = Object.values<Types.Frame>(_frames);

    frames.some(({ index, length, offset }) => {
      if (index === 0 && offset > scrollOffset) {
        startIndex = 0;
      }

      if (
        startIndex === -1 &&
        offset <= scrollOffset &&
        offset + length >= scrollOffset
      ) {
        startIndex = index * numColumns;
      }

      if (
        endIndex === -1 &&
        offset < scrollOffset + visibleLength &&
        offset + length >= scrollOffset + visibleLength
      ) {
        const lastInRow = (index + 1) * numColumns - 1;

        const lastElement = this._getLastElement();

        endIndex = lastInRow > lastElement ? lastElement : lastInRow;
      }

      return startIndex !== -1 && endIndex !== -1;
    });

    if (endIndex === -1) {
      endIndex = frames.length - 1;
    }

    const visibilityDetails = {
      startIndex,
      endIndex,
    };

    this._visiblityDetails = visibilityDetails;
    return visibilityDetails;
  }

  renderItem(info: AnimatedLazyList.ListRenderItemInfo<ItemT>) {
    const { currentAnimation, isAnimating } = this.state;
    const { index } = info;

    if (currentAnimation && isAnimating) {
      const { startIndex, endIndex } = this._getVisiblityDetails();

      if (index >= startIndex && index <= endIndex) {
        return this.renderAnimated(info);
      }
    }
    return this.renderUnanimated(info);
  }

  renderAnimated(info: AnimatedLazyList.ListRenderItemInfo<ItemT>) {
    const { numColumns = 1, itemStartStyle, renderItem } = this.props;
    const { currentAnimation } = this.state;
    const { index } = info;

    const visibilityDetails = this._getVisiblityDetails();
    const { startIndex, endIndex } = visibilityDetails;

    const {
      onAnimationEnd: onListAnimationEnd,
      stagger = 0,
      staggerByRow,
      ...animation
    } = flattenProp<AnimatedLazyList.Animation>(currentAnimation, info);

    const callAnimationEnd =
      stagger < 0 ? startIndex === index : endIndex === index;

    const visibilityIndex = staggerByRow
      ? Math.floor((index - startIndex) / numColumns)
      : index - startIndex;

    animation.delay = (animation.delay || 0) + stagger * visibilityIndex;

    if (stagger < 0) {
      animation.delay +=
        -stagger *
        (staggerByRow
          ? Math.floor((endIndex - startIndex) / numColumns)
          : endIndex - startIndex);
    }

    let complete = false;

    const onAnimationEnd = callAnimationEnd
      ? ({ finished }: { finished: boolean }) => {
          if (finished && !complete) {
            complete = true;
            const chainedAnimation = onListAnimationEnd?.();

            if (chainedAnimation) {
              this._animationsPending.unshift(chainedAnimation);
            }

            this.setState({ isAnimating: false });
            this._startNextAnimation();
          }
        }
      : undefined;

    const animate = { ...animation, onAnimationEnd };

    const style = flattenAnimationHx(this._animationHx, itemStartStyle, info);

    return (
      <AnimatedView animate={animate} style={style}>
        {renderItem?.(info)}
      </AnimatedView>
    );
  }

  renderUnanimated(info: AnimatedLazyList.ListRenderItemInfo<ItemT>) {
    const { itemStartStyle, renderItem } = this.props;
    const { currentAnimation } = this.state;

    const animations = currentAnimation
      ? [...this._animationHx, currentAnimation]
      : this._animationHx;

    return (
      <View style={flattenAnimationHx(animations, itemStartStyle, info)}>
        {renderItem?.(info)}
      </View>
    );
  }

  private _onContentSizeChange(w: number, h: number) {
    const { onContentSizeChange } = this.props;
    const { currentAnimation, isAnimating } = this.state;

    onContentSizeChange?.(w, h);
    this._visiblityDetails = null;

    if (isAnimating) {
      this.setState({ currentAnimation: null }, () =>
        this.setState({ currentAnimation }),
      );
    }
  }

  private _onScroll(event: any) {
    const { onScroll } = this.props;

    onScroll?.(event);
    this._visiblityDetails = null;
  }

  private _onRefresh() {
    const { onRefresh, refreshItemAnimate } = this.props;

    onRefresh?.();

    if (refreshItemAnimate) {
      this._animationHx = [];
      this._animationsPending = [];

      this._visiblityDetails = null;

      this.setState({ currentAnimation: null }, () => {
        setTimeout(() => {
          this.animate(refreshItemAnimate);
        }, 1000);
      });
    }
  }

  //
  render() {
    const { scrollEnabled = true } = this.props;
    const { currentAnimation, isAnimating } = this.state;

    return (
      <LazyList
        ref={this._flatListRef}
        {...this.props}
        onContentSizeChange={this._onContentSizeChange}
        onRefresh={this._onRefresh}
        onScroll={this._onScroll}
        extraData={currentAnimation}
        renderItem={this.renderItem}
        horizontal={false}
        scrollEnabled={scrollEnabled && !isAnimating}
      />
    );
  }
}

export { SharedLazyArray } from '@huds0n/lazy-list';
