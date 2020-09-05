import { TileEngine } from "kontra";
import Player from "../sprites/player";
import Npc from "../sprites/npc";
import Fixed from "../sprites/fixed";
import Pickup from "../sprites/pickup";
import { ENTITY_TYPE } from "../common/consts";
import { on, EV_UPDATECONVOTRIGGER, EV_GIVEQUEST } from "../common/events";
import store from "../services/store";

export default () => {
  /* Not sure if we're doing quest giving in the world manager frankly,
  or even the progress cache. So will move all this later on. */
  /* I'm not 100% sure if an integrity check needs to be done to make sure
  the right convo is loaded. As it technically the data should be fairly pristine.
  Keep an eye on it anyway. */
  on(EV_GIVEQUEST, d => store.updateQuestData(d));
  on(EV_UPDATECONVOTRIGGER, d => store.updateProgress(d));

  // TODO: I think it's time to move entity and quest stuff out of world manager.
  return {
    createWorld: ({ areaId, playerStartId }) => {
      const { entities, mapKey } = store
        .getWorldData()
        .find(x => x.areaId === areaId);

      const map = store.getMapData(mapKey);
      const tileEngine = TileEngine(map);

      const aiPathLayer = tileEngine.layers.find(x => x.id === 2);
      let aiPathGrid = [];

      for (let i = 0; i < aiPathLayer.width; i++) {
        aiPathGrid.push([]);
        for (let j = 0; j < aiPathLayer.height; j++) {
          const t = tileEngine.tileAtLayer("AIPath", { row: i, col: j });
          aiPathGrid[i].push(t);
        }
      }

      const playerStart = entities.find(
        x => x.customProperties.playerStartId === playerStartId
      );

      const playerEntityData = store
        .getEntityData()
        .find(x => x.id === "player");

      const player = Player({
        id: "player",
        x: playerStart.x,
        y: playerStart.y,
        entityData: playerEntityData,
        collisionMethod: (layer, sprite) => {
          // If 16x16
          const spriteBody = {
            x: 0,
            y: 4,
            width: 10,
            height: 8
          };

          const t = {
            width: spriteBody.width,
            height: spriteBody.height,
            x: sprite.x + spriteBody.x,
            y: sprite.y + spriteBody.y,
            anchor: sprite.anchor
          };

          return tileEngine.layerCollidesWith(layer, t);
        }
      });

      tileEngine.addObject(player);

      return {
        mapKey,
        tileEngine,
        aiPathGrid,
        player,
        sprites: entities
          .map(entity => {
            // TODO: Tidy all this up
            /* Check if entity exists in store as it may have been destroyed
            or collected. TODO: Move the pickup check out of here, it's a bit
            confusing alongside other field entity types. */
            const { id } = entity;

            let ent = null;

            const entityData = store.getEntityData().find(ent => ent.id === id);

            if (entity.customProperties) {
              store.pushProgress({
                id: entity.id,
                ...entity.customProperties
              });
            }

            switch (entityData.type) {
              case ENTITY_TYPE.PICKUP:
                const alreadyCollected = store.getEntityFromStore(id);
                if (alreadyCollected) return null;
                ent = Pickup({
                  ...entity,
                  entityData,
                  collisionMethod: (layer, sprite) =>
                    tileEngine.layerCollidesWith(layer, sprite)
                });
                break;
              case ENTITY_TYPE.NPC:
                ent = Npc({
                  ...entity,
                  entityData,
                  aiPathGrid,
                  collisionMethod: (layer, sprite) =>
                    tileEngine.layerCollidesWith(layer, sprite)
                });
                break;
              case ENTITY_TYPE.DOOR:
                // Doors may be animated, this is just temporary usage.
                ent = Fixed({
                  ...entity,
                  entityData,
                  collisionMethod: (layer, sprite) =>
                    tileEngine.layerCollidesWith(layer, sprite)
                });
                break;
              case ENTITY_TYPE.FIXED:
                ent = Fixed({
                  ...entity,
                  entityData,
                  collisionMethod: (layer, sprite) =>
                    tileEngine.layerCollidesWith(layer, sprite)
                });
                break;
              default:
                return null;
            }

            /* May wish to add a flag if you want to add it to tilemap or not */
            tileEngine.addObject(ent);
            return ent;
          })
          .filter(e => e)
          .concat([player])
      };
    }
  };
};
