export const mainFlow = [
  {
    id: "m1",
    actor: "daryl",
    from: null,
    to: null,
    text: "This is the first message, what will you choose?",
    choices: [
      {
        id: "m1a",
        actor: "player",
        from: "m1",
        to: "m2",
        text: "I will select A.",
        choices: [],
        actions: []
      },
      {
        id: "m1b",
        actor: "player",
        from: "m1",
        to: "m3",
        text: "I will select B.",
        choices: [],
        actions: []
      }
    ],
    actions: []
  },
  {
    id: "m2",
    actor: "daryl",
    from: "m1a",
    to: "m4",
    text:
      "You have selected the A button.You have selected the A button.You have selected the A button.You have selected the A button.You have selected the A button.",
    choices: [],
    actions: []
  },
  {
    id: "m3",
    actor: "daryl",
    from: "m1b",
    to: null,
    text:
      "You have selected the B button.You have selected the B button.You have selected the B button.You have selected the B button.You have selected the B button.",
    choices: [],
    actions: ["cancel"]
  },
  {
    id: "m4",
    actor: "daryl",
    from: "m2",
    to: null,
    text: "This should be the last in the chain for A.",
    choices: [],
    actions: ["endConversation", "save"]
  }
];

export const ENTITY_TYPE = {
  PICKUP: 0,
  NPC: 1,
  ENEMY: 2,
  SWITCH: 3,
  DOOR: 4,
  CONTAINER: 5,
  ENTRANCE: 6,
  PLAYER: 99
};

export const entityData = [
  {
    id: "player",
    type: ENTITY_TYPE.PLAYER,
    sheet: "assets/entityimages/little_devil.png",
    frameWidth: 16,
    frameHeight: 16,
    animations: {
      idle: {
        frames: [0, 1, 2, 3],
        frameRate: 8
      },
      walk: {
        frames: [3, 4, 5, 6, 7],
        frameRate: 16
      }
    }
  },
  {
    id: "standard_npc",
    type: ENTITY_TYPE.NPC,
    sheet: "assets/entityimages/little_orc.png",
    frameWidth: 16,
    frameHeight: 16,
    animations: {
      idle: {
        frames: [0, 1, 2, 3],
        frameRate: 8
      },
      walk: {
        frames: [3, 4, 5, 6, 7],
        frameRate: 16
      }
    }
  },
  {
    id: "standard_potion",
    type: ENTITY_TYPE.PICKUP,
    sheet: "assets/tileimages/test.png",
    frameWidth: 16,
    frameHeight: 16,
    animations: {
      idle: {
        frames: [89],
        frameRate: 1
      }
    }
  },
  {
    id: "standard_door",
    type: ENTITY_TYPE.DOOR,
    sheet: "assets/tileimages/test.png",
    frameWidth: 32,
    frameHeight: 16,
    manualAnimation: true,
    animations: {
      idle: {
        frames: [33],
        frameRate: 1,
        loop: false
      },
      open: {
        frames: [99],
        frameRate: 1,
        loop: false
      }
    }
  },
  {
    id: "standard_entrance",
    type: ENTITY_TYPE.ENTRANCE,
    sheet: "assets/tileimages/test.png",
    frameWidth: 16,
    frameHeight: 16,
    animations: {
      idle: {
        frames: [86],
        frameRate: 1
      }
    }
  }
];

export const worldData = [
  {
    id: "area1",
    mapKey: "assets/tiledata/test",
    entities: [
      {
        x: 120,
        y: 160,
        name: "Daryl",
        id: "daryl",
        assetId: "standard_npc",
        customProperties: {}
      },
      {
        x: 156,
        y: 72,
        name: "Potion",
        id: "potion",
        assetId: "standard_potion",
        customProperties: {}
      },
      {
        x: 112,
        y: 48,
        name: "Door",
        id: "door",
        assetId: "standard_door",
        customProperties: {
          goesTo: "area2"
        }
      },
      {
        x: 128,
        y: 192,
        z: 10,
        name: "Entrance",
        id: "entranceMarker",
        assetId: "standard_entrance",
        customProperties: {}
      }
    ]
  },
  {
    id: "area2",
    mapKey: "assets/tiledata/test",
    entities: [
      {
        x: 112,
        y: 48,
        name: "Door",
        id: "door",
        assetId: "standard_door",
        customProperties: {
          goesTo: "area1"
        }
      },
      {
        x: 128,
        y: 128,
        z: 10,
        name: "Entrance",
        id: "entranceMarker",
        assetId: "standard_entrance",
        customProperties: {}
      }
    ]
  }
];
