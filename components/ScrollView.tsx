// For web (use CSS overflow)
export const ScrollView = ({
    children,
    style,
    contentContainerStyle
  }) => (
    <div style={{ overflowY: "auto", ...style }}>
      <div style={contentContainerStyle}>{children}</div>
    </div>
  );

  // For React Native: Just use the built-in `ScrollView`
  import { ScrollView } from "react-native";
