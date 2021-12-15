// import React from 'react'
// import { IoChatbubbleEllipses, IoPaperPlaneOutline } from 'react-icons/io5'

// const ChatArea = ({chats,handleMsg}) => {
//     return (
//         <div className="pt-side-chat">
// 			<p className="pt-chat-title">Group Chat</p>
// 			<div className="pt-chats">
// 				{Boolean(chats[openedProject]) ? (
// 					chats[openedProject].length > 0 ? (
// 						chats[openedProject].map((c, i) => (
// 							<Chat me={c.user_id === cookies.user._id} key={i}>
// 								<div className="pt-chat-inner">
// 									{c.user_id !== cookies.user._id && (
// 										<span className="pt-chat-name">
// 											{c.fullname}
// 										</span>
// 									)}
// 									<span className="pt-chat-text">
// 										{c.text}
// 									</span>
// 									<span className="pt-chat-date">
// 										{moment(c.date).format('HH:MM')}
// 									</span>
// 								</div>
// 							</Chat>
// 						))
// 					) : (
// 						<div className="chat-empty fja">
// 							<IoChatbubbleEllipses />
// 							<span>No chats</span>
// 						</div>
// 					)
// 				) : (
// 					<div className="chat-empty fja">
// 						<IoChatbubbleEllipses />
// 						<span>No chats</span>
// 					</div>
// 				)}
// 			</div>

// 			<div className="pt-chats-input">
// 				<input
// 					autoFocus
// 					type="text"
// 					placeholder="Enter a message"
// 					value={msg}
// 					onChange={(e) => setMsg(e.target.value)}
// 					onKeyPress={(e) => e.key === 'Enter' && handleMsg()}
// 				/>

// 				<span className="pt-chats-send fja" onClick={handleMsg}>
// 					<IoPaperPlaneOutline />
// 				</span>
// 			</div>
// 		</div>
//     )
// }

// export default ChatArea
