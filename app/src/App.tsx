import { Route, Routes } from 'react-router-dom';

import { NavBar } from '@core/components';
import { Home } from '@features/home';
import { BoardDetail, Boards } from '@features/boards';

export function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/boards/:id" element={<BoardDetail />} />
      </Routes>
    </>
  );
}
