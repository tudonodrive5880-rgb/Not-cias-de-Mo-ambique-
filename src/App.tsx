/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Article from './pages/Article';
import Categories from './pages/Categories';
import Bookmarks from './pages/Bookmarks';
import Settings from './pages/Settings';
import SplashScreen from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>
      
      {!showSplash && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}> 
              <Route index element={<Home />} />
              <Route path="article/:id" element={<Article />} />
              <Route path="categories" element={<Categories />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )} 
    </>
  );
}