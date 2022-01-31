import React from 'react';

interface playerProps {
    sourceUrl: string;
    createObjectUrl?: boolean;
}

declare const YT: React.FC<playerProps>;

export { YT };
