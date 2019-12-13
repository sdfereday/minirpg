import m from "mithril";
import {
  on,
  EV_CONVOSTART,
  EV_CONVONEXT,
  EV_CONVOEND,
  EV_DEBUGLOG
} from "../common/events";

const typeWriter = ({ text, onTyped = str => {}, onFinished = () => {} }) => {
  let animId = "";
  let str = "";

  const t = (s = "", i = 0) => {
    if (i > text.length) {
      cancelAnimationFrame(animId);
      onFinished();
      return;
    }

    str = s + text.charAt(i);

    i += 1;
    onTyped(str);

    requestAnimationFrame(() => t(str, i));
  };

  return {
    start: () => (animId = requestAnimationFrame(() => t()))
  };
};

const Shell = ({ attrs }) => {
  let debugText = [];
  let isTyping = false;
  let name = "";
  let text = "";
  let choices = [];
  let actors = [];

  const onConvoStart = ({ startId, currentActors }) => {
    if (isTyping) return;
    isTyping = true;

    actors = currentActors;

    const props = attrs.conversationManager.start(startId);
    if (!props) return;

    const actorName = props.actor
      ? actors.find(x => props.actor === x.id).name
      : null;
    name = actorName;
    text = "";
    choices = [];

    // Apparently this needs to be forced (will double check)
    m.redraw();

    // Start typewriter effect
    typeWriter({
      text: props.text,
      onTyped: str => {
        text = str;
        m.redraw();
      },
      onFinished: () => {
        isTyping = false;
        choices = props.choices.length ? props.choices : [];
        m.redraw();
      }
    }).start();
  };

  const onConvoNext = () => {
    if (isTyping) return;
    isTyping = true;

    const props = attrs.conversationManager.goToNext();
    if (!props) return;

    const actorName = props.actor
      ? actors.find(x => props.actor === x.id).name
      : null;
    name = actorName;
    text = "";
    choices = [];

    // Apparently this needs to be forced (will double check)
    m.redraw();

    // Start typewriter effect
    typeWriter({
      text: props.text,
      onTyped: str => {
        text = str;
        m.redraw();
      },
      onFinished: () => {
        isTyping = false;
        choices = props.choices.length ? props.choices : [];
        m.redraw();
      }
    }).start();
  };

  const onChoiceSelected = choice => {
    if (isTyping) return;
    isTyping = true;

    const props = attrs.conversationManager.goToExact(choice.to);
    if (!props) return;

    const actorName = props.actor
      ? actors.find(x => props.actor === x.id).name
      : null;
    name = actorName;
    text = "";
    choices = [];

    // Apparently this needs to be forced (will double check)
    m.redraw();

    // Start typewriter effect
    typeWriter({
      text: props.text,
      onTyped: str => {
        text = str;
        m.redraw();
      },
      onFinished: () => {
        isTyping = false;
        choices = props.choices.length ? props.choices : [];
        m.redraw();
      }
    }).start();
  };

  const onConvoEnd = () => {
    isTyping = false;
    name = "";
    text = "";
    choices = [];
    actors = [];
    m.redraw();
  };

  const onDebugLog = (output, clearPrevious = false, maxLines = 4) => {
    
    debugText = clearPrevious ? [output] : [...debugText, output];

    if (debugText.length > maxLines) {
      debugText.splice(0, 1);
    }

    m.redraw();
  };

  return {
    oninit: () => {
      console.log("UI initialized.");
      on(EV_CONVOSTART, onConvoStart);
      on(EV_CONVONEXT, onConvoNext);
      on(EV_CONVOEND, onConvoEnd);
      on(EV_DEBUGLOG, onDebugLog);
    },
    view: () => {
      return m("div", { class: "uiShell" }, [
        text &&
          m("div", { class: "dialogueBoxOuter" }, [
            m("div", { class: "dialogue" }, [
              m("span", name ? `${name}:` : ""),
              m("span", name ? `"${text}"` : text),
              m(
                "div",
                { class: "choiceWindow" },
                choices.map(choice => {
                  return m(
                    "button",
                    {
                      class: "choiceBox",
                      onclick: () => onChoiceSelected(choice)
                    },
                    choice.text
                  );
                })
              ),
              isTyping ? "" : m("span", { class: "arrow" })
            ])
          ]),
        m("div", { class: "debugWindow" }, [
          debugText.map(s => {
            return m("span", s);
          }),
          m("span", { class: "cursor4" }, "_")
        ])
      ]);
    }
  };
};

export default (
  props = {
    conversationManager,
    sprites,
    onConversationChoice: () => {}
  }
) => {
  return {
    start: () =>
      m.mount(document.getElementById("ui"), {
        view: () => m(Shell, props)
      })
  };
};
