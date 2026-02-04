export default function ScreenLayout({ map, children }) {
  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {map}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          background: "white",
          padding: 16,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }}
      >
        {children}
      </div>
    </div>
  );
}
