declare module '.png' {
  // React Native resolves static images to a numeric resource ID
  const value: number;
  export default value;
}

declare module '.jpg' {
  const value: number;
  export default value;
}

declare module '.jpeg' {
  const value: number;
  export default value;
}

declare module '.gif' {
  const value: number;
  export default value;
}

declare module '.webp' {
  const value: number;
  export default value;
}

declare module '.svg' {
  import * as React from 'react';
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}a