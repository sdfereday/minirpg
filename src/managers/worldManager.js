import { dataAssets, TileEngine, setStoreItem, getStoreItem } from "kontra";

// This need to be making use of inheritance
import Player from "../sprites/player";
import Npc from "../sprites/npc";
import Fixed from "../sprites/fixed";
import Pickup from "../sprites/pickup";
import { ENTITY_TYPE } from "../common/consts";

export default (options = { dataKey: "assets/gameData/worldData.json" }) => {
  const { dataKey } = options;
  const worldData = dataAssets[dataKey];

  // TODO: Pass this in?
  const entityDataKey = "assets/gameData/entityData.json";
  const entityTable = dataAssets[entityDataKey];

  // TODO: Move these commands out of here and in to some sort of helper layer.
  const entitiesInStore = getStoreItem("entities");
  const getEntityFromStore = (id) =>
    entitiesInStore.length ? entitiesInStore.find((e) => e.id === id) : null;

  return {
    getAllEntitiesOfType: (type) => {
      const existingEntities = getStoreItem("entities");
      return existingEntities
        ? existingEntities.filter((ent) => ent.type === type)
        : [];
    },
    getAllEntities: () => getStoreItem("entities"),
    getEntityFromStore: (id) => getEntityFromStore(id),
    resetEntityStates: () => setStoreItem("entities", []),
    savePickup: (entityData) => {
      const { id, type, ttl } = entityData;
      const existingEntities = getStoreItem("entities");
      const existingEntity = existingEntities
        ? existingEntities.find((x) => x.id === id)
        : null;

      /* This needs cleaning up */
      setStoreItem(
        "entities",
        existingEntities
          ? existingEntities
              .filter((ent) => ent.id !== id)
              .concat([
                {
                  id,
                  type,
                  ttl,
                  qty: existingEntity ? existingEntity.qty + 1 : 1
                }
              ])
          : [{ id, type, ttl, qty: 1 }]
      );
    },
    createWorld: ({ areaId, playerStartId }) => {
      const { entities, mapKey } = worldData.find((x) => x.areaId === areaId);
      const map = dataAssets[mapKey];
      const tileEngine = TileEngine(map);

      const playerStart = entities.find(
        (x) => x.customProperties.playerStartId === playerStartId
      );

      const playerEntityData = entityTable.find((x) => x.id === "player");

      const player = Player({
        id: "player",
        x: playerStart.x,
        y: playerStart.y,
        entityData: playerEntityData,
        collisionMethod: (layer, sprite) => {
          // If 16x16
          const spriteBody = {
            x: 2,
            y: 8,
            width: 11,
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
        // tileEngine.layerCollidesWith(layer, sprite)
      });

      tileEngine.addObject(player);

      return {
        mapKey,
        tileEngine,
        player,
        sprites: entities
          .map((entity) => {
            // TODO: Tidy all this up
            /* Check if entity exists in store as it may have been destroyed
            or collected. TODO: Move the pickup check out of here, it's a bit
            confusing alongside other field entity types. */
            const { id } = entity;

            let ent = null;

            const entityData = entityTable.find((ent) => ent.id === id);

            switch (entityData.type) {
              case ENTITY_TYPE.PICKUP:
                const alreadyCollected = getEntityFromStore(id);
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
                  collisionMethod: (layer, sprite) =>
                    tileEngine.layerCollidesWith(layer, sprite)
                });
                break;
              case ENTITY_TYPE.FIXED || ENTITY_TYPE.DOOR:
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
          .filter((e) => e)
          .concat([player])
      };
    }
  };
};
