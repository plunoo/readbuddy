import React, { useState, useEffect } from 'react';
import { speak } from '../services/voiceService';
import RobotAvatar from '../components/RobotAvatar';

interface ReadingScreenProps {
  onBack: () => void;
}

const READING_BOOKS = [
  {
    id: 'cat-story',
    title: 'The Cat and the Hat',
    level: 'Beginner',
    pages: [
      {
        text: 'The cat sat on a mat.',
        image: '🐱',
        words: ['cat', 'sat', 'mat']
      },
      {
        text: 'The cat wore a red hat.',
        image: '👒',
        words: ['cat', 'red', 'hat']
      },
      {
        text: 'The cat ran to catch a rat.',
        image: '🐭',
        words: ['cat', 'ran', 'rat']
      }
    ]
  },
  {
    id: 'sun-story',
    title: 'The Bright Sun',
    level: 'Beginner',
    pages: [
      {
        text: 'The sun is big and bright.',
        image: '☀️',
        words: ['sun', 'big', 'bright']
      },
      {
        text: 'The sun makes plants grow.',
        image: '🌱',
        words: ['sun', 'plants', 'grow']
      },
      {
        text: 'I love the warm sun.',
        image: '😊',
        words: ['love', 'warm', 'sun']
      }
    ]
  },
  {
    id: 'dog-story',
    title: 'My Pet Dog',
    level: 'Easy',
    pages: [
      {
        text: 'My dog likes to play fetch.',
        image: '🐕',
        words: ['dog', 'play', 'fetch']
      },
      {
        text: 'He runs very fast in the park.',
        image: '🏃',
        words: ['runs', 'fast', 'park']
      },
      {
        text: 'My dog is my best friend.',
        image: '❤️',
        words: ['dog', 'best', 'friend']
      }
    ]
  }
];

const ReadingScreen: React.FC<ReadingScreenProps> = ({ onBack }) => {
  const [selectedBook, setSelectedBook] = useState<typeof READING_BOOKS[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedBook) {
      speak("Welcome to the Reading Library! Pick a story to read together!");
    }
  }, [selectedBook]);

  const handleBookSelect = (book: typeof READING_BOOKS[0]) => {
    setSelectedBook(book);
    setCurrentPage(0);
    speak(`Let's read "${book.title}" together!`);
  };

  const handleWordClick = (word: string) => {
    setHighlightedWord(word);
    speak(word);
    setTimeout(() => setHighlightedWord(null), 1000);
  };

  const readPage = () => {
    if (selectedBook) {
      speak(selectedBook.pages[currentPage].text);
    }
  };

  const nextPage = () => {
    if (selectedBook && currentPage < selectedBook.pages.length - 1) {
      setCurrentPage(currentPage + 1);
      setTimeout(() => speak(selectedBook.pages[currentPage + 1].text), 500);
    } else if (selectedBook) {
      speak("The end! Great reading!");
      setTimeout(() => {
        setSelectedBook(null);
        setCurrentPage(0);
      }, 2000);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setTimeout(() => speak(selectedBook!.pages[currentPage - 1].text), 500);
    }
  };

  if (selectedBook) {
    const page = selectedBook.pages[currentPage];
    const words = page.text.split(' ');

    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setSelectedBook(null)} 
            className="text-3xl hover:scale-110 transition-transform"
          >
            ⬅️
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black text-indigo-700">{selectedBook.title}</h1>
            <div className="text-sm text-gray-600">Page {currentPage + 1} of {selectedBook.pages.length}</div>
          </div>
          <button 
            onClick={readPage}
            className="text-3xl hover:scale-110 transition-transform animate-pulse"
          >
            🔊
          </button>
        </div>

        {/* Book Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Image */}
          <div className="text-8xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
            {page.image}
          </div>

          {/* Text with clickable words */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-indigo-200 mb-6 max-w-lg">
            <p className="text-2xl leading-relaxed text-center">
              {words.map((word, index) => (
                <span key={index}>
                  <button
                    onClick={() => handleWordClick(word.replace(/[.,!?]/g, ''))}
                    className={`
                      hover:bg-yellow-200 rounded px-1 transition-all duration-200 font-bold
                      ${highlightedWord === word.replace(/[.,!?]/g, '') ? 'bg-yellow-300 scale-110' : ''}
                      ${page.words.includes(word.replace(/[.,!?]/g, '').toLowerCase()) ? 'text-indigo-600' : 'text-gray-700'}
                    `}
                  >
                    {word}
                  </button>
                  {index < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`
                px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95
                ${currentPage === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }
              `}
            >
              ← Previous
            </button>

            <button
              onClick={nextPage}
              className="px-6 py-3 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white transition-all transform hover:scale-105 active:scale-95"
            >
              {currentPage < selectedBook.pages.length - 1 ? 'Next →' : 'Finish 🎉'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-y-auto">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-400 to-purple-500 text-white flex justify-between items-center">
        <button onClick={onBack} className="text-2xl font-bold hover:scale-110 transition-transform">⬅ Back</button>
        <h1 className="text-2xl font-black">📚 READING LIBRARY</h1>
        <div className="w-8" />
      </div>

      <div className="p-6 space-y-6">
        {/* Robot Guide */}
        <div className="text-center mb-8">
          <RobotAvatar expression="happy" size="md" />
          <div className="mt-4 bg-indigo-100 p-4 rounded-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-indigo-100" />
            <p className="text-lg font-bold text-indigo-700">
              Let's read together! Pick a story! 📖
            </p>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid gap-4">
          {READING_BOOKS.map((book) => (
            <button
              key={book.id}
              onClick={() => handleBookSelect(book)}
              className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:border-indigo-300 hover:scale-105 transition-all duration-300 transform active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="text-6xl">📖</div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-black text-gray-800">{book.title}</h3>
                  <p className="text-gray-600">{book.pages.length} pages to read together</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                    book.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                    book.level === 'Easy' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {book.level}
                  </div>
                </div>
                <div className="text-3xl text-indigo-500">▶️</div>
              </div>
            </button>
          ))}
        </div>

        {/* Features Info */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 border-2 border-dashed border-purple-300">
          <div className="text-center">
            <div className="text-4xl mb-2">✨</div>
            <h3 className="text-lg font-black text-purple-800">Reading Features</h3>
            <ul className="text-purple-600 text-sm mt-2">
              <li>• Click words to hear them spoken</li>
              <li>• Listen to full pages with the speaker button</li>
              <li>• Interactive stories that grow with you</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingScreen;