
import React, { useState } from 'react';
import { VideoLesson } from '../types';

interface Props {
  onPushVideo: (video: VideoLesson) => void;
  onBack: () => void;
}

const AdminView: React.FC<Props> = ({ onPushVideo, onBack }) => {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState(1);
  const [url, setUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    const newVideo: VideoLesson = {
      id: crypto.randomUUID(),
      title,
      level,
      videoUrl: url,
      thumbnail: `https://picsum.photos/seed/${Math.random()}/640/360`,
      duration: '5:00'
    };

    onPushVideo(newVideo);
    setIsSuccess(true);
    setTitle('');
    setUrl('');
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="max-w-sm mx-auto space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="btn-edu btn-edu-ghost w-10 h-10 text-xl font-bold">←</button>
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Content Creator</h2>
      </div>

      <div className="edu-card p-8 bg-white space-y-8">
        <div className="text-center space-y-2">
          <div className="text-5xl">📽️</div>
          <h3 className="text-xl font-bold text-gray-800">Push AI Video</h3>
          <p className="text-gray-400 text-xs font-medium italic">Your lesson will appear instantly for students.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Lesson Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blending Sounds 'S' and 'A'"
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-purple-500 outline-none font-bold text-gray-800 placeholder:text-gray-300 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Target Level</label>
            <select 
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-purple-500 outline-none font-bold text-gray-800"
            >
              {[1,2,3,4,5,6].map(l => <option key={l} value={l}>Level {l}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Video Resource Link</label>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste URL from AI Studio..."
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-purple-500 outline-none font-bold text-gray-800 placeholder:text-gray-300 transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full btn-edu btn-edu-purple py-4 text-lg font-black"
          >
            🚀 Push to Library
          </button>
        </form>

        {isSuccess && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl text-center font-bold animate-in fade-in slide-in-from-top-2 border-2 border-green-100">
            ✅ Lesson Pushed Successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;
