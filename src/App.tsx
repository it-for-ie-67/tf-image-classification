import { get_model } from "./model";
import { useState, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";

interface Prediction {
  className: string;
  probability: number;
}

function App() {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    get_model()
      .then((model) => {
        setModel(model);
        setReady(true);
      })
      .catch((err) => {
        alert(err);
        setReady(false);
      });
  }, []);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // User needs to select an image
    if (!e.target.files) return;
    // There has to be one file.
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Read the file
    const fileReader = new FileReader();
    fileReader.addEventListener("load", async () => {
      setPreviewImage(fileReader.result);
      setPredictions([]);
    });
    fileReader.readAsDataURL(file);
  };

  if (!ready) return <div>loading...</div>;

  function handleLoad(e: any) {
    if (!model) return;
    model
      .classify(e.target)
      .then((predictions) => {
        setPredictions(predictions);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <h1>Image Classifier</h1>
      <div>
        <input type="file" onChange={handleSelectImage} />
      </div>
      <div>
        {previewImage && (
          <img
            id="my-img"
            src={previewImage}
            alt="preview-image"
            style={{ height: "50vh" }}
            onLoad={handleLoad}
          />
        )}
      </div>

      <div>
        <h2>Prediction</h2>
        {predictions?.map((p) => (
          <div key={p.className}>
            {p.className} (มั่นใจ {(p.probability * 100).toFixed(0)}%)
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
