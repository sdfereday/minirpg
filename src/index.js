/* Credits
* Asset Pack:
* https://pixel-poem.itch.io/dungeon-assetpuck
* https://0x72.itch.io/dungeontileset-ii
*/

/* Libs */
import { init, GameLoop, load, initKeys } from "kontra";
import UI from "./ui/ui";

/* Common utils, objects and events */
import Entity from "./sprites/entity";
import { circleCollision } from "./common/helpers";
import { ENTITY_TYPE } from "./common/consts";
import {
  allOff,
  on,
  emit,
  EV_SCENECHANGE,
  EV_CONVOSTART,
  EV_CONVONEXT,
  EV_CONVOEND
} from "./common/events";

/* States for global use */
import startConvo from "./states/startConvo";
import fieldState from "./states/fieldState";
import curtainState from "./states/curtainState";

/* Game managers */
import SceneManager from "./managers/sceneManager";
import WorldManager from "./managers/worldManager";
import ConversationManager from "./managers/conversationManager";
import ReactionManager from "./managers/reactionManager";
import StateMachine from "./managers/stateManager";

/* Canvas initialization */
const { canvas } = init();
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;
ctx.scale(3, 3);

/* Primary field scene */
const FieldScene = ({ areaId }) => {
  /* World creation */
  const { createWorld, saveEntityState } = WorldManager();
  const { loadedEntities, tileEngine } = createWorld({ areaId });

  /* Dialogue creation */
  const conversationManager = ConversationManager();

  /* Main states creation */
  const sceneStateMachine = StateMachine();
  const screenEffectsStateMachine = StateMachine();

  /* All but the player are generated here */
  const playerStart = loadedEntities.find(x => x.id === "entranceMarker");

  const player = Entity({
    x: playerStart ? playerStart.x : 128,
    y: playerStart ? playerStart.y : 128,
    name: "Player",
    id: "player",
    assetId: "player",
    controlledByUser: true,
    tileEngine
  });

  /* Sprites collection for easier render / updates */
  let sprites = [player, ...loadedEntities];

  /* Decide what happens on different player interaction events (was separated, seemed pointless at this stage) */
  const reactionManager = ReactionManager([
    {
      type: ENTITY_TYPE.DOOR,
      reactionEvent: firstAvailable => {
        // TODO: Entities should manage their own animations (same problem seen elsewhere)
        firstAvailable.playAnimation("open");

        screenEffectsStateMachine.push(
          curtainState({
            id: "curtain",
            ctx,
            direction: -1,
            onFadeComplete: () => {
              allOff([EV_SCENECHANGE]);
              emit(EV_SCENECHANGE, {
                areaId: firstAvailable.customProperties.goesTo
              });
            }
          })
        );
      }
    },
    {
      type: ENTITY_TYPE.PICKUP,
      reactionEvent: firstAvailable => {
        firstAvailable.ttl = 0;
        saveEntityState(firstAvailable);
      }
    },
    {
      type: ENTITY_TYPE.NPC,
      reactionEvent: (firstAvailable, sprites) =>
        sceneStateMachine.push(
          startConvo({
            id: "conversation",
            onNext: props => emit(EV_CONVONEXT),
            // Note: should only effect current actors, not all sprites!
            onExit: () => sprites.map(spr => (spr.movementDisabled = false)),
            onEntry: props => {
              emit(EV_CONVOSTART, { startId: "m1", currentActors: sprites });
              sprites.map(spr => (spr.movementDisabled = true));
            }
          }),
          {
            currentActors: sprites.find(spr => spr.id === firstAvailable.id)
          }
        )
    }
  ]);

  /* Bootstrap some states for when the scene loads */
  sceneStateMachine.push(
    fieldState({
      id: "field",
      sprites,
      tileEngine,
      reactionManager
    })
  );

  screenEffectsStateMachine.push(
    curtainState({
      id: "curtain",
      ctx,
      direction: 1
    })
  );

  /* Scene events */
  on(EV_CONVOEND, () => sceneStateMachine.pop());

  /* Finally, enable the UI (TODO: Double check this is clearing properly) */
  UI({
    conversationManager,
    sprites
  }).start();

  /* Primary loop */
  return GameLoop({
    update: () => {
      let collisions = [];

      /* Check for anything dead (GC does the rest) */
      sprites = sprites.filter(spr => spr.isAlive());

      /* Add a flag to sprite to enable/disable collision checks */
      sprites.map(sprite => {
        sprite.update();

        /* This is a bit flawed as we check for collision events on every sprite when in reality we only need it
        for say the player. Or, more to the point, only certain collisions apply in certain contexts. If a player walks to
        a door, we only need for the player to detect the collision and trigger an action. The door can just be a prop. */
        const collidingWith = circleCollision(
          sprite,
          sprites.filter(s => s.id !== sprite.id)
        );

        sprite.isColliding = collidingWith.length > 0;

        if (sprite.isColliding) {
          collisions.push(sprite);
        }
      });

      /* This would be a great place to sort by distance also (todo later). */
      sceneStateMachine.update({
        origin: player,
        collisions: collisions.filter(c => c.id !== player.id)
      });
    },
    render: () => {
      tileEngine.render();

      /* Edit z-order based on 'y' then change render order */
      sprites
        .sort((a, b) => Math.round(a.y - a.z) - Math.round(b.y - b.z))
        .forEach(sprite => sprite.render());

      screenEffectsStateMachine.update();
    }
  });
};

/* Make sure to embed your tilesets or it'll run in to problems,
TODO: Can we also const the dataKeys across the board plz. */
load(
  "assets/tileimages/test.png",
  "assets/tiledata/test.json",
  "assets/entityimages/little_devil.png",
  "assets/entityimages/little_orc.png",
  "assets/gameData/conversationData.json",
  "assets/gameData/entityData.json",
  "assets/gameData/worldData.json"
).then(assets => {
  initKeys();

  const sceneManager = SceneManager({ sceneObject: FieldScene });
  sceneManager.loadScene({ areaId: "area3" });

  on(EV_SCENECHANGE, props => sceneManager.loadScene({ ...props }));
});
