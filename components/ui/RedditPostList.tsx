'use client';

import { RedditPost } from '@/lib/types';
import { formatRedditDate } from '@/lib/reddit';
import { motion } from 'framer-motion';

interface RedditPostListProps {
  posts: RedditPost[];
  cityName: string;
  tradeName: string;
}

export default function RedditPostList({ posts, cityName, tradeName }: RedditPostListProps) {
  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 md:p-8"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Local Reddit Activity</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#334155] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-[#94a3b8]">
            No recent Reddit posts found for {tradeName}s in {cityName}.
          </p>
          <p className="text-[#94a3b8] text-sm mt-2">
            This city may not have an active subreddit we track.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-[#334155]">
        <h3 className="text-xl font-semibold text-white">Leads You&apos;re Missing</h3>
        <p className="text-[#94a3b8] mt-1">
          Real people in {cityName} asked for a {tradeName} recently. Were you part of the conversation?
        </p>
      </div>

      <div className="divide-y divide-[#334155]">
        {posts.map((post, index) => (
          <motion.a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="block p-6 hover:bg-[#334155]/50 transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium group-hover:text-[#f59e0b] transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3 mt-2 text-sm text-[#94a3b8]">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.numComments} comments
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formatRedditDate(post.createdUtc)}
                  </span>
                  <span className="text-[#f59e0b]">r/{post.subreddit}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-[#94a3b8] group-hover:text-[#f59e0b] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="p-6 bg-[#141821] border-t border-[#334155]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-[#ef4444]/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <p className="text-white font-medium">Every Post = A Potential Customer</p>
            <p className="text-[#94a3b8] text-sm mt-1">
              These are real people actively looking for services like yours.
              When you&apos;re not available to answer, they find someone else.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
