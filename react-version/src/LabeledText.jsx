export const LabeledText = ({ label, children }) => (
  <p>
    {label ? 
      <span className="text-label">{label}: </span> : ''
    }    
    <span className="text">{children}</span>
  </p>
);