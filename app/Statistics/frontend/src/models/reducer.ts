import type { StatsState } from "./Stats";

export const initialStats: StatsState = {
  shooting: {
    points: 0,
    oneMade: 0,
    oneAttempt: 0,
    twoMade: 0,
    twoAttempt: 0,
    threeMade: 0,
    threeAttempt: 0,
  },
  rebounds: {
    total: 0,
    offensive: 0,
    defensive: 0,
  },
  defense: {
    blocksFor: 0,
    blocksAgainst: 0,
    steals: 0,
    turnovers: 0,
  },
  fouls: {
    committed: 0,
    drawn: 0,
    technical: 0,
  },
  assists: 0,
};

export type Action =
  | {
      type: "shoot";
      payload: {
        kind: "one" | "two" | "three";
        made: boolean;
      };
    }
  | {
      type: "undoShoot";
      payload: {
        kind: "one" | "two" | "three";
        made: boolean;
      };
    }
  | {
      type: "rebound";
      payload: {
        kind: "offensive" | "defensive";
        delta: 1 | -1;
      };
    }
  | {
      type: "assists";
      delta: 1 | -1;
    }
  | {
      type: "defense";
      payload: {
        field: "steals" | "turnovers" | "blocksFor" | "blocksAgainst";
        delta: 1 | -1;
      };
    }
  | {
      type: "foul";
      payload: {
        kind: "committed" | "drawn" | "technical";
        delta: 1 | -1;
      };
    };

export function statsReducer(state: StatsState, action: Action): StatsState {
  switch (action.type) {
    case "shoot": {
      const { kind, made } = action.payload;
      const value = kind === "one" ? 1 : kind === "two" ? 2 : 3;

      return {
        ...state,
        shooting: {
          ...state.shooting,

          points: made ? state.shooting.points + value : state.shooting.points,

          [`${kind}Attempt`]: state.shooting[`${kind}Attempt`] + 1,

          [`${kind}Made`]: made
            ? state.shooting[`${kind}Made`] + 1
            : state.shooting[`${kind}Made`],
        },
      };
    }

    case "undoShoot": {
      const { kind, made } = action.payload;
      const value = kind === "one" ? 1 : kind === "two" ? 2 : 3;

      return {
        ...state,
        shooting: {
          ...state.shooting,

          points: made
            ? Math.max(0, state.shooting.points - value)
            : state.shooting.points,

          [`${kind}Attempt`]: Math.max(0, state.shooting[`${kind}Attempt`] - 1),

          [`${kind}Made`]: made
            ? Math.max(0, state.shooting[`${kind}Made`] - 1)
            : state.shooting[`${kind}Made`],
        },
      };
    }

    case "rebound": {
      const { kind, delta } = action.payload;
      return {
        ...state,
        rebounds: {
          ...state.rebounds,
          total: state.rebounds.total + delta,
          [kind]: state.rebounds[kind] + delta,
        },
      };
    }

    case "assists":
      return {
        ...state,
        assists: state.assists + action.delta,
      };

    case "defense":
      return {
        ...state,
        defense: {
          ...state.defense,
          [action.payload.field]:
            state.defense[action.payload.field] + action.payload.delta,
        },
      };

    case "foul":
      return {
        ...state,
        fouls: {
          ...state.fouls,
          [action.payload.kind]:
            state.fouls[action.payload.kind] + action.payload.delta,
        },
      };

    default:
      return state;
  }
}
