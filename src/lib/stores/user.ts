// user.js
import type { User } from '$lib/types';
import { writable } from 'svelte/store';

export const userStore = writable<User | null>(null);
