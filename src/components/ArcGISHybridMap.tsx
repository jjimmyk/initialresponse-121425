// TypeScript declaration for ArcGIS embeddable components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'arcgis-embedded-map': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'item-id'?: string;
          theme?: string;
          center?: string;
          scale?: string;
          'portal-url'?: string;
        },
        HTMLElement
      >;
    }
  }
}

type ArcGISHybridMapProps = {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  basemap?: string;
};

export function ArcGISHybridMap({
  center,
  zoom,
  className,
  style,
  basemap
}: ArcGISHybridMapProps) {
  // Default center from embeddable map spec
  const centerStr = center 
    ? `${center[0]},${center[1]}` 
    : "-91.85971806034803,43.23618948909988";
  
  // Default scale from embeddable map spec (note: scale is different from zoom)
  const scaleStr = "9244648.868618";
  
  const combinedStyle = {
    height: '100%',
    width: '100%',
    ...style
  };

  return (
    <arcgis-embedded-map 
      className={className}
      style={combinedStyle}
      item-id="4cff146c11d747f994717381ef8594cc"
      theme="light"
      center={centerStr}
      scale={scaleStr}
      portal-url="https://disastertech.maps.arcgis.com"
    />
  );
}


