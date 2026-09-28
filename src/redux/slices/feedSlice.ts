import { createSlice } from '@reduxjs/toolkit';

export interface Story {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  isSeen: boolean;
}

export interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  image: string;
  tags: string[];
  caption: string;
  likes: number;
  dislikes: number;
  comments: number;
  timeAgo: string;
  likedBy: { avatar: string }[];
  likedByText: string;
}

interface FeedState {
  stories: Story[];
  posts: Post[];
}

const DUMMY_STORIES: Story[] = [
  { id: 's1', user: { id: 'u1', name: 'You', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }, isSeen: false },
  { id: 's2', user: { id: 'u2', name: 'Nina', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' }, isSeen: false },
  { id: 's3', user: { id: 'u3', name: 'Tate', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' }, isSeen: true },
  { id: 's4', user: { id: 'u4', name: 'Mike', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' }, isSeen: true },
  { id: 's5', user: { id: 'u5', name: 'Roy', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' }, isSeen: false },
  { id: 's6', user: { id: 'u6', name: 'Nate', avatar: 'https://randomuser.me/api/portraits/men/85.jpg' }, isSeen: false },
  { id: 's7', user: { id: 'u7', name: 'Sarah', avatar: 'https://randomuser.me/api/portraits/women/21.jpg' }, isSeen: true },
  { id: 's8', user: { id: 'u8', name: 'John', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' }, isSeen: false },
];

const generateDummyPosts = (): Post[] => {
  const posts: Post[] = [];
  const tagsList = ['#Photos', '#Lightroom', '#Nature', '#Urban', '#Travel', '#Food', '#Lifestyle', '#Art'];
  const names = ['Jane Cooper', 'Wade Warren', 'Esther Howard', 'Cameron Williamson', 'Brooklyn Simmons', 'Leslie Alexander'];
  
  for (let i = 1; i <= 20; i++) {
    // Generate 2 random unique tags
    const shuffledTags = [...tagsList].sort(() => 0.5 - Math.random());
    const tags = [shuffledTags[0], shuffledTags[1]];
    
    posts.push({
      id: `p${i}`,
      user: {
        id: `pu${i}`,
        name: names[i % names.length],
        avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 10}.jpg`,
        rating: +(Math.random() * (5 - 3.5) + 3.5).toFixed(1), // Random rating between 3.5 and 5.0
      },
      // Using deterministic picsum images so they don't change wildly on reload
      image: `https://picsum.photos/id/${i * 15 + 10}/800/800`,
      tags,
      caption: i % 2 === 0 ? 'Creating culinary magic in my kitchen!' : 'Exploring the beautiful city streets today.',
      likes: Math.floor(Math.random() * 3000) + 100,
      dislikes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 800),
      timeAgo: `${(i % 5) + 1} Day${i % 5 === 0 ? '' : 's'} Ago`,
      likedBy: [
        { avatar: `https://randomuser.me/api/portraits/women/${(i * 2) % 90}.jpg` },
        { avatar: `https://randomuser.me/api/portraits/men/${(i * 3) % 90}.jpg` },
      ],
      likedByText: `Liked by timur.kzb and ${Math.floor(Math.random() * 900) + 50} others`,
    });
  }
  return posts;
};

const initialState: FeedState = {
  stories: DUMMY_STORIES,
  posts: generateDummyPosts(),
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // We can add actions later if needed, e.g., toggleLike, markStorySeen
  },
});

export default feedSlice.reducer;
