import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

export async function get_model() {
  try {
    // Load mobilenet.
    await tf.ready();
    const model = await mobilenet.load({
      version: 1,
      alpha: 1.0,
    });
    return model;
  } catch (err) {
    console.log(err);
    return null;
  }
}
