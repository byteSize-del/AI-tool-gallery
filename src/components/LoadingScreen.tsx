interface LoadingScreenProps {
  message?: string;
}

/**
 * Full-screen hand-drawn loading overlay shown on every route change.
 */
export default function LoadingScreen({ message = "Loading" }: LoadingScreenProps) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <svg
        className="pencil-loader"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 50 L44 16 L52 24 L18 58 L8 60 Z"
          fill="#f4b942"
          stroke="#2b2b2b"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M44 16 L52 24" stroke="#2b2b2b" strokeWidth="3" />
        <path d="M14 54 L18 58" stroke="#2b2b2b" strokeWidth="3" />
        <path
          d="M8 60 L18 58"
          stroke="#2b2b2b"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <p className="loading-screen__text">
        {message}
        <span className="dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    </div>
  );
}
