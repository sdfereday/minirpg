import StateMachine from "../managers/stateManager";
import damagedState from "../states/damagedState";
import healthyState from "../states/healthyState";
import { moveSprite, flipSprite } from "../common/spriteFunctions";
import { uniqueId, dist } from "../common/helpers";
import {
  Sprite,
  dataAssets,
  imageAssets,
  SpriteSheet,
  keyPressed
} from "kontra";

// Really important TODO: Split sprites out so they aren't sharing the same
// properties. Do you really need a ladder to animate for example? Just give it
// a 'static' flag or no animations full stop.
// TODO: Can we make sure we don't use the 'controlled by user' nonsense in the data anymore. What
// if I want to use a different entity for the player?
export default ({
  id,
  x,
  y,
  z = 1,
  customProperties = {},
  collisionMethod = (layer, sprite) => {}
}) => {
  if (!id) {
    throw new Error(
      "Entity is fairly useless without an id, you should add one."
    );
  }

  const entityStateMachine = StateMachine();

  const dataKey = "assets/gameData/entityData.json";
  const entityData = dataAssets[dataKey];

  const {
    name,
    type,
    animations,
    frameWidth,
    frameHeight,
    sheet,
    collisionBodyOptions = null,
    manualAnimation = false,
    controlledByUser = false,
    controlledByAI = false,
    collidesWithTiles = true
  } = entityData.find(ent => ent.id === id);

  let spriteSheet = SpriteSheet({
    image: imageAssets[sheet],
    frameWidth,
    frameHeight,
    animations
  });

  /* These are passable to states so they can act accordingly */
  let dir = { x: 0, y: 0 }; // AI (to add later)
  let targetDestination = null;
  let movementDisabled = false;

  /* Id should really be named 'class' since its re-used. */
  const sprite = Sprite({
    instId: uniqueId(id),
    id,
    type,
    name,
    x,
    y,
    z,
    customProperties,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser,
    controlledByAI,
    collisionBodyOptions,
    manualAnimation,
    onAttacked: () => {
      // Push an internal state for damage effect (whatever that's going to be)
      console.log(id);
    },
    enableMovement: () => (movementDisabled = false),
    disableMovement: () => (movementDisabled = true),
    lookAt: ({ x, y }) => {
      flipSprite({
        direction: {
          x: sprite.x > x ? -1 : 1,
          y: sprite.y > y ? -1 : 1
        },
        sprite
      });
    },
    update: () => {
      entityStateMachine.update();

      /* Movement - Massively a work in progress - TODO: Sort out data and splitting out concerns of sprite types. 
      targestDestination prop may or may not be an AI thing, as we might want to automatically move the player
      to a location. So make sure it's accessible by all entities further up. */
      if (targetDestination !== null) {
        /* You could also stick pathfinding in here or in AI when it's implemented */
        dir = {
          x: sprite.x > targetDestination.x ? -1 : 1,
          y: sprite.y > targetDestination.y ? -1 : 1
        };
      } else if (controlledByUser && targetDestination == null) {
        dir = {
          x: keyPressed("a") ? -1 : keyPressed("d") ? 1 : 0,
          y: keyPressed("w") ? -1 : keyPressed("s") ? 1 : 0
        };
      } else {
        // This is literally just to stop things like ladders moving. It shouldn't be done this
        // way at all so refactor all of this asap.
        dir = {
          x: 0,
          y: 0
        };
      }

      const { directionNormal } = moveSprite({
        dir:
          movementDisabled && targetDestination === null ? { x: 0, y: 0 } : dir,
        sprite,
        checkCollision: sprite => collisionMethod("Collision", sprite)
      });

      // Flip the sprite on movement
      flipSprite({ direction: directionNormal, sprite });

      // Do some animations
      const isMoving = directionNormal.x !== 0 || directionNormal.y !== 0;

      if (!sprite.manualAnimation) {
        sprite.playAnimation(isMoving ? "walk" : "idle");
      }

      // Call this to ensure animations are player
      sprite.advance();
    }
  });

  // console.log("=> Sprite generated:", sprite.name, sprite.id);
  // console.log(sprite);

  return sprite;
};
