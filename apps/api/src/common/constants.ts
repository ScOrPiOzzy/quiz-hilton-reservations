// constants

import { ImageType } from './models/image.type';

export const enum EnvKey {
  JWT_SECRET = 'JWT_SECRET',
  COUCHBASE_HOST = 'COUCHBASE_HOST',
  COUCHBASE_USERNAME = 'COUCHBASE_USERNAME',
  COUCHBASE_PASSWORD = 'COUCHBASE_PASSWORD',
  COUCHBASE_BUCKET = 'COUCHBASE_BUCKET',
}

export const hotelImages = [
  'https://www.hilton.com/im/en/WUXQQQQ/23788017/lobby.jpg?impolicy=crop&cw=4638&ch=3092&gravity=NorthWest&xposition=181&yposition=0&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXQQQQ/23788011/pool.jpg?impolicy=crop&cw=4638&ch=3092&gravity=NorthWest&xposition=181&yposition=0&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXQQQQ/23887245/guest-room.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=27&yposition=0&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXQQQQ/23887248/suite-room.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=3&yposition=0&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXTRHX/19579614/skrxx-1-.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=0&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXSSHT/16515695/svjs-stusdouble1.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=1&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXSSHT/16515718/suss-mcrs1.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=1&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXSSHT/16515790/lobby1.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=1&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXSSHT/16515728/spin2cycle1.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=1&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXSSHT/16515769/meetingroom.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=1&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXSSHT/16515740/spin2cycle2.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=7&rw=640&rh=427',
].map<ImageType>((url, index) => ({ id: `img_$(index)`, order: index, url }));

export const restaurantImages = [
  'https://www.hilton.com/im/en/WUXQQQQ/23788038/function-room-pdr.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=175&yposition=0&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXQQQQ/23788020/lobby-lounge.jpg?impolicy=crop&cw=4638&ch=3092&gravity=NorthWest&xposition=181&yposition=0&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXQQQQ/23788051/add.jpg?impolicy=crop&cw=4638&ch=3092&gravity=NorthWest&xposition=181&yposition=0&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXQQQQ/23788024/heritage-restaurant-bar.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=174&yposition=0&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXSSHT/16515740/spin2cycle2.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=7&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXSSHT/16515812/breakfastroom1.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=1&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXSSHT/16515772/lobby3.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=1&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXSSHT/16515805/-breakfast3.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=1&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXWIHX/17672583/dining-1-.jpg?impolicy=crop&cw=5000&ch=3333&gravity=NorthWest&xposition=0&yposition=6&rw=640&rh=427',
  'https://www.hilton.com/im/en/WUXTRHX/19579878/dining-1.jpg?impolicy=crop&cw=4500&ch=3000&gravity=NorthWest&xposition=0&yposition=0&rw=640&rh=427',
].map<ImageType>((url, index) => ({ id: `img_$(index)`, order: index, url }));
