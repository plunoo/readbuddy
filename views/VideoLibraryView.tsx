
import React, { useState } from 'react';
import { ChildProfile, VideoLesson } from '../types';

interface Props {
  profile: ChildProfile | null;
  videos: VideoLesson[];
}

const VideoLibraryView: React.FC<Props> = ({ profile, videos }) => {
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);

  if (activeVideo) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col p-4">
        <button 
          onClick={() => setActiveVideo(null)}
          className="self-end bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all"
        >
          ✕
        </button>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center text-white flex-col gap-4">
            <span className="text-6xl animate-pulse">📺</span>
            <p className="font-bold">Playing: {activeVideo.title}</p>
            <p className="text-sm opacity-50">Video would play here from {activeVideo.videoUrl}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Watch & Learn</h2>
        <p className="text-gray-500 font-medium">Prerecorded lessons just for you!</p>
      </header>

      {videos.length === 0 ? (
        <div className="edu-card p-12 text-center space-y-4">
          <div className="text-6xl grayscale opacity-20">🎬</div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No videos pushed yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {videos.map(video => (
            <div 
              key={video.id} 
              className="edu-card overflow-hidden group cursor-pointer active:scale-95 transition-transform"
              onClick={() => setActiveVideo(video)}
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-100 group-hover:bg-black/40 transition-all">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl shadow-black/20">
                    <span className="text-blue-600 text-3xl translate-x-0.5">▶</span>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-black px-2 py-1 rounded-md backdrop-blur-md">
                  {video.duration}
                </div>
              </div>
              <div className="p-5 flex justify-between items-center bg-white">
                <div>
                  <h4 className="font-extrabold text-gray-800 text-lg leading-tight tracking-tight">{video.title}</h4>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Level {video.level} Lesson</span>
                </div>
                {profile?.completedVideos.includes(video.id) && (
                  <span className="bg-green-100 text-green-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">Watched!</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoLibraryView;
