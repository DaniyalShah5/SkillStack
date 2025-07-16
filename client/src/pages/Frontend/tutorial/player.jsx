import "./player.css";

export const Player = (props) => {
  return (
    <div className="iframe-container">
      <iframe
        src={props.vidUrl}
        title="YouTube Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

    </div>
  );
};
