"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importStar)(require("react"));
const react_native_1 = require("react-native");
const animations_1 = require("@huds0n/animations");
const components_1 = require("@huds0n/components");
const state_1 = require("../state");
function TransitionContainerScreen() {
    const [show, setShow] = (0, react_1.useState)(true);
    const backPress = () => state_1.DemoState.setProp('screen', 'WELCOME');
    const transitionPress = () => setShow(!show);
    const transitionLabel = show ? 'Hide' : 'Show';
    return (<>
      <react_native_1.View style={styles.contentsContainer}>
        <react_native_1.Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum
        </react_native_1.Text>

        <animations_1.TransitionContainer style={styles.transitionContainer} dependencies={show ? 'SHOW' : 'HIDE'}>
          {show && (<react_native_1.Text style={styles.text}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
              est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
              velit, sed quia non numquam eius modi tempora incidunt ut labore
              et dolore magnam aliquam quaerat voluptatem.
            </react_native_1.Text>)}
        </animations_1.TransitionContainer>

        <react_native_1.Text style={styles.text}>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
          qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
          dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
          quia non numquam eius modi tempora incidunt ut labore et dolore magnam
          aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
          exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
          ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
          ea voluptate velit esse quam nihil molestiae consequatur, vel illum
          qui dolorem eum fugiat quo voluptas nulla pariatur?
        </react_native_1.Text>
      </react_native_1.View>
      <react_native_1.View style={styles.footer}>
        <components_1.Button onPress={backPress}>Back</components_1.Button>
        <components_1.Button onPress={transitionPress}>{transitionLabel}</components_1.Button>
      </react_native_1.View>
    </>);
}
exports.default = TransitionContainerScreen;
const styles = react_native_1.StyleSheet.create({
    contentsContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    text: { padding: 20 },
    transitionContainer: { width: '100%' },
});
