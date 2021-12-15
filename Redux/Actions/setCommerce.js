import { SET_COMMERCE } from "./Constants.js";

export default function SetCommerce(qty) {
  return {
    type: SET_COMMERCE,
    payload: qty,
  };
}
