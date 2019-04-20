import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="App">
          <div className="leftNav">
            <div className="userBox">
              <img src="https://www.petmd.com/sites/default/files/Acute-Dog-Diarrhea-47066074.jpg" alt="avatar" className="userBox__avatar"/>
              <p className="userBox__name">Thanh Nguyen</p>
              <a href="#" className="userBox__action">log out</a>
            </div>
            <ul className="channelList">
              <li className="channelItem">#awesome</li>
              <li className="channelItem channelItem--active">#general</li>
            </ul>
          </div>
          <div className="mainBody">
            <div className="channelInfo">
              <div className="channelInfo__topic">Topic: Awesome stuff</div>
              <div className="channelInfo__tag">#general</div>
            </div>

            <div className="channelSubInfo text-center">That's every message!</div>

            <div className="messageList">
              <div className="messageItem">
                <img src="https://www.petmd.com/sites/default/files/Acute-Dog-Diarrhea-47066074.jpg" alt="DOG" className="messageItem__userImg"/>
                <div className="messageItem__content">
                  <span className="messageItem__userName">Thanh Nguyen</span>
                  <span className="messageItem__time">3:37 PM</span>
                  <p className="messageItem__text">Hi! I am Thanh. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt qui eum autem id alias. In assumenda architecto modi placeat adipisci!?</p>
                </div>
              </div>
              <div className="messageItem">
                <img src="https://www.petmd.com/sites/default/files/Acute-Dog-Diarrhea-47066074.jpg" alt="DOG" className="messageItem__userImg"/>
                <div className="messageItem__content">
                  <span className="messageItem__userName">Thanh Nguyen</span>
                  <span className="messageItem__time">3:38 PM</span>
                  <p className="messageItem__text">Anyone there?</p>
                </div>
              </div>
              <div className="messageItem">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLuCfTIpDaXqrU5UKGICsq55vJKxssUFmHRCC4HnqoICrhWNgP" alt="DOG" className="messageItem__userImg"/>
                <div className="messageItem__content">
                  <span className="messageItem__userName">superbot</span>
                  <span className="messageItem__time">3:40 PM</span>
                  <p className="messageItem__text">Hi Thanh, can I help you?</p>
                </div>
              </div>
            </div>

            <input type="text" className="messageInput" placeholder="Message #general"/>

          </div>
          <div className="rightNav">
            <div className="userList">
              <div className="userItem">
                <span className="userItem__status"></span>
                <span className="userItem__name">Thanh Nguyen</span>
              </div>
              <div className="userItem">
                <span className="userItem__status userItem__status--online"></span>
                <span className="userItem__name">cleverbot</span>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
