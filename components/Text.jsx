// Reusable text components
export const NormalText = ({ color, style, children }) => (
    <p style={{ color, fontSize: 14, ...style }}>{children}</p>
  );

  export const MediumText = ({ color, size, style, children }) => (
    <p style={{
      color,
      fontSize: size || 16,
      fontWeight: 500,
      ...style
    }}>
      {children}
    </p>
  );
