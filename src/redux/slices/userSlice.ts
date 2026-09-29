import { createSlice } from '@reduxjs/toolkit';

export interface ProfilePost {
    id: string;
    image: string;
    rating: number;
    likedByText: string;
    likedBy: { avatar: string }[];
    isLocked?: boolean;
}

export interface UserProfile {
    name: string;
    avatar: string;
    bio: string;
    stats: {
        posts: number;
        followers: number;
        following: number;
    };
    gallery: ProfilePost[];
    tags: ProfilePost[];
}

const initialState: UserProfile = {
    name: 'Jane Cooper',
    avatar: require('../../assets/images/snapreel_clean_image_1.png'),
    bio: 'Baldwin Lee: A Southern Portrait...',
    stats: {
        posts: 45,
        followers: 125,
        following: 98,
    },
    gallery: [
        {
            id: 'g1',
            image: require('../../assets/images/snapreel_clean_image_4.png'),
            rating: 4.8,
            likedByText: 'Liked by 2156 users',
            likedBy: [
                { avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                { avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
            ],
        },
        {
            id: 'g2',
            image: require('../../assets/images/snapreel_clean_image_5.png'),
            rating: 3.6,
            likedByText: 'Liked by 467 users',
            likedBy: [
                { avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
                { avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
            ],
        },
        {
            id: 'g3',
            image: require('../../assets/images/snapreel_clean_image_7.png'),
            rating: 4.2,
            likedByText: 'Liked by 2156 users',
            likedBy: [
                { avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
                { avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
            ],

        },
        {
            id: 'g4',
            image: require('../../assets/images/snapreel_clean_image_6.png'),
            rating: 4.4,
            likedByText: 'Liked by 512 users',
            likedBy: [
                { avatar: 'https://randomuser.me/api/portraits/women/21.jpg' },
                { avatar: 'https://randomuser.me/api/portraits/men/85.jpg' },
            ],
        },
        {
            id: 'g5',
            image: require('../../assets/images/snapreel_clean_image_2.png'),
            rating: 4.7,
            likedByText: 'Liked by 843 users',
            likedBy: [
                { avatar: 'https://randomuser.me/api/portraits/women/55.jpg' },
                { avatar: 'https://randomuser.me/api/portraits/men/34.jpg' },
            ],
        },
        {
            id: 'g6',
            image: require('../../assets/images/snapreel_clean_image_9.png'),
            rating: 4.1,
            likedByText: 'Liked by 201 users',
            likedBy: [
                { avatar: 'https://randomuser.me/api/portraits/women/19.jpg' },
                { avatar: 'https://randomuser.me/api/portraits/men/71.jpg' },
            ],
        },
    ],
    tags: [
        {
            id: 't1',
            image: require('../../assets/images/snapreel_clean_image_7.png'),
            rating: 4.0,
            likedByText: 'Liked by 1024 users',
            likedBy: [
                { avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
                { avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
            ],
        },
        {
            id: 't2',
            image: require('../../assets/images/snapreel_clean_image_8.png'),
            rating: 4.9,
            likedByText: 'Liked by 5000 users',
            likedBy: [
                { avatar: 'https://randomuser.me/api/portraits/women/29.jpg' },
                { avatar: 'https://randomuser.me/api/portraits/men/50.jpg' },
            ],
        },
        {
            id: 't3',
            image: require('../../assets/images/snapreel_clean_image_10.png'),
            rating: 4.5,
            likedByText: 'Liked by 889 users',
            likedBy: [
                { avatar: 'https://randomuser.me/api/portraits/women/38.jpg' },
                { avatar: 'https://randomuser.me/api/portraits/men/66.jpg' },
            ],
        },
        {
            id: 't4',
            image: require('../../assets/images/snapreel_clean_image_11.png'),
            rating: 4.3,
            likedByText: 'Liked by 124 users',
            likedBy: [
                { avatar: 'https://randomuser.me/api/portraits/women/81.jpg' },
                { avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
            ],
        }
    ],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
});

export default userSlice.reducer;
