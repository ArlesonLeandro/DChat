import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Overlay from './Routes/Overlay'
import Interface from './Routes/Interface'
import {handleAttachments, handleURLs, handleText} from "./utilities"
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000')

export default function App(){
    return(
        <Routes>
            <Route exact path='/' element={<Overlay socket={socket} handleText={handleText} handleAttachments={handleAttachments} handleURLs={handleURLs} />} />
            <Route path='/interface' element={<Interface socket={socket} handleText={handleText} handleAttachments={handleAttachments} handleURLs={handleURLs} />} />
        </Routes>
    )
}