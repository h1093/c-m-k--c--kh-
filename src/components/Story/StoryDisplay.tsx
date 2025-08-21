import React from 'react';
import type { StorySegment } from '../../types';

interface StoryDisplayProps {
  segment: StorySegment | null;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ segment }) => {
  if (!segment) {
    return <p className="text-gray-500 italic">Màn đêm tĩnh lặng. Một nỗi kinh hoàng mới đang chờ đợi...</p>;
  }

  const paragraphs = segment.scene.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="text-gray-300 leading-relaxed space-y-4 prose prose-invert max-w-none prose-p:text-gray-300 prose-p:leading-8 prose-p:font-serif">
      {paragraphs.map((p, index) => (
        <p key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>{p}</p>
      ))}
    </div>
  );
};

export default StoryDisplay;