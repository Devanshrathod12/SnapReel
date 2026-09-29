import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Comment {
  id: string;
  user: { name: string; avatar: string };
  text: string;
  likes: number;
  isLiked: boolean;
  timeAgo: string;
}

export interface Reel {
  id: string;
  videoUrl: string;
  thumbnail: string;
  user: {
    avatar: string;
    name: string;
    followers: string;
  };
  caption: string;
  likes: number;
  dislikes: number;
  comments: number;
  bookmarks: number;
  rating: number;
  timeAgo: string;
  likedBy: { avatar: string }[];
  likedByText: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  commentsList?: Comment[];
}

const initialState: { reels: Reel[] } = {
  reels: [
    {
      id: 'r1',
      videoUrl:
        'https://cdn.pixabay.com/video/2022/11/27/140642-775595913_large.mp4',
      thumbnail: '',
      user: {
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        name: 'Jenny Wilson',
        followers: '1,5k Followers',
      },
      caption: 'A peaceful ocean view with beautiful waves 🌊',
      likes: 1542,
      dislikes: 223,
      comments: 15,
      bookmarks: 128,
      rating: 4.8,
      timeAgo: '12 Days Ago',
      likedBy: [
        { avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/women/21.jpg' },
      ],
      likedByText: 'Liked by nate.diaz and 245 others',
      isLiked: false,
      isDisliked: false,
      isSaved: false,
      isFollowing: false,
      commentsList: [
        {
          id: 'c1',
          user: { name: 'Sarah Jenkins', avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
          text: 'This is absolutely stunning! 😍',
          likes: 45,
          isLiked: false,
          timeAgo: '2h'
        },
        {
          id: 'c2',
          user: { name: 'Mike Ross', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
          text: 'Where is this located?',
          likes: 12,
          isLiked: false,
          timeAgo: '5h'
        }
      ]
    },

    {
      id: 'r2',
      videoUrl:
        'https://cdn.pixabay.com/video/2020/03/27/34411-402333375_large.mp4',
      thumbnail: '',
      user: {
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        name: 'Guy Hawkins',
        followers: '3,2k Followers',
      },
      caption: 'Feel the rhythm and dance like nobody is watching 💃✨',
      likes: 892,
      dislikes: 45,
      comments: 120,
      bookmarks: 300,
      rating: 4.5,
      timeAgo: '2 Days Ago',
      likedBy: [
        { avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
      ],
      likedByText: 'Liked by sarah.j and 890 others',
    },

    {
      id: 'r3',
      videoUrl:
        'https://cdn.pixabay.com/video/2024/06/28/218541_large.mp4',
      thumbnail: '',
      user: {
        avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
        name: 'Esther Howard',
        followers: '860 Followers',
      },
      caption: 'A smooth drive through the city 🚗💨',
      likes: 640,
      dislikes: 12,
      comments: 48,
      bookmarks: 75,
      rating: 4.2,
      timeAgo: '5 Days Ago',
      likedBy: [
        { avatar: 'https://randomuser.me/api/portraits/men/50.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/women/29.jpg' },
      ],
      likedByText: 'Liked by alex.m and 120 others',
    },

    {
      id: 'r4',
      videoUrl:
        'https://cdn.pixabay.com/video/2018/01/06/13704-250154065_large.mp4',
      thumbnail: '',
      user: {
        avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
        name: 'Olivia Carter',
        followers: '2,1k Followers',
      },
      caption: 'Dance, smile and enjoy every moment 💃🔥',
      likes: 1120,
      dislikes: 31,
      comments: 86,
      bookmarks: 142,
      rating: 4.7,
      timeAgo: '8 Days Ago',
      likedBy: [
        { avatar: 'https://randomuser.me/api/portraits/women/41.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/men/28.jpg' },
      ],
      likedByText: 'Liked by emma.j and 380 others',
    },

    {
      id: 'r5',
      videoUrl:
        'https://cdn.pixabay.com/video/2016/06/27/3608-172488324_large.mp4',
      thumbnail: '',
      user: {
        avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
        name: 'Daniel Cooper',
        followers: '4,5k Followers',
      },
      caption: 'Watching the train pass by 🚆 What a view!',
      likes: 1875,
      dislikes: 52,
      comments: 97,
      bookmarks: 215,
      rating: 4.9,
      timeAgo: '3 Days Ago',
      likedBy: [
        { avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/women/37.jpg' },
      ],
      likedByText: 'Liked by mike.travel and 520 others',
    },

    {
      id: 'r6',
      videoUrl:
        'https://cdn.pixabay.com/video/2015/10/16/995-142621134_large.mp4',
      thumbnail: '',
      user: {
        avatar: 'https://randomuser.me/api/portraits/women/36.jpg',
        name: 'Sophia Miller',
        followers: '2,8k Followers',
      },
      caption: 'Beautiful views from the airplane window ✈️☁️',
      likes: 2310,
      dislikes: 44,
      comments: 135,
      bookmarks: 340,
      rating: 4.9,
      timeAgo: '1 Day Ago',
      likedBy: [
        { avatar: 'https://randomuser.me/api/portraits/women/52.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/men/34.jpg' },
      ],
      likedByText: 'Liked by travelwithsam and 710 others',
    },

    {
      id: 'r7',
      videoUrl:
        'https://cdn.pixabay.com/video/2024/12/15/246856_large.mp4',
      thumbnail: '',
      user: {
        avatar: 'https://randomuser.me/api/portraits/men/19.jpg',
        name: 'Alex Morgan',
        followers: '5,2k Followers',
      },
      caption: 'Nature at its best — a breathtaking waterfall 🌊💙',
      likes: 2980,
      dislikes: 38,
      comments: 174,
      bookmarks: 490,
      rating: 5.0,
      timeAgo: '6 Hours Ago',
      likedBy: [
        { avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/men/39.jpg' },
      ],
      likedByText: 'Liked by naturelover and 920 others',
    },
  ],
};

const reelSlice = createSlice({
  name: 'reels',
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<string>) => {
      const reel = state.reels.find((r) => r.id === action.payload);
      if (reel) {
        if (reel.isLiked) {
          reel.isLiked = false;
          reel.likes -= 1;
          reel.likedByText = reel.likedByText.replace('you and ', '');
        } else {
          reel.isLiked = true;
          reel.likes += 1;
          if (reel.isDisliked) {
            reel.isDisliked = false;
            reel.dislikes -= 1;
          }
          if (!reel.likedByText.includes('you and')) {
            reel.likedByText = reel.likedByText.replace('Liked by ', 'Liked by you and ');
          }
        }
      }
    },
    toggleDislike: (state, action: PayloadAction<string>) => {
      const reel = state.reels.find((r) => r.id === action.payload);
      if (reel) {
        reel.isDisliked = !reel.isDisliked;
        reel.dislikes += reel.isDisliked ? 1 : -1;
        if (reel.isDisliked && reel.isLiked) {
          reel.isLiked = false;
          reel.likes -= 1;
          reel.likedByText = reel.likedByText.replace('you and ', '');
        }
      }
    },
    toggleSave: (state, action: PayloadAction<string>) => {
      const reel = state.reels.find((r) => r.id === action.payload);
      if (reel) {
        reel.isSaved = !reel.isSaved;
        reel.bookmarks += reel.isSaved ? 1 : -1;
      }
    },
    toggleFollow: (state, action: PayloadAction<string>) => {
      const reel = state.reels.find((r) => r.id === action.payload);
      if (reel) {
        reel.isFollowing = !reel.isFollowing;
      }
    },
    addComment: (state, action: PayloadAction<{ reelId: string; text: string }>) => {
      const reel = state.reels.find((r) => r.id === action.payload.reelId);
      if (reel) {
        if (!reel.commentsList) reel.commentsList = [];
        reel.commentsList.unshift({
          id: Date.now().toString(),
          user: { name: 'You', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
          text: action.payload.text,
          likes: 0,
          isLiked: false,
          timeAgo: 'Just now',
        });
        reel.comments += 1;
      }
    },
    toggleCommentLike: (state, action: PayloadAction<{ reelId: string; commentId: string }>) => {
      const reel = state.reels.find((r) => r.id === action.payload.reelId);
      if (reel && reel.commentsList) {
        const comment = reel.commentsList.find((c) => c.id === action.payload.commentId);
        if (comment) {
          comment.isLiked = !comment.isLiked;
          comment.likes += comment.isLiked ? 1 : -1;
        }
      }
    },
  },
});

export const { toggleLike, toggleDislike, toggleSave, toggleFollow, addComment, toggleCommentLike } = reelSlice.actions;

export default reelSlice.reducer;