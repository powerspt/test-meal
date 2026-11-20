import React, { useState, useMemo } from 'react';
import { SchoolInfo } from '../types';
import { StoreItem, store } from '../services/store';
import {
  MessageSquareHeart,
  RefreshCw,
  Send,
  ThumbsUp,
  AlertCircle,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';

interface CommunityPageProps {
  currentSchool: SchoolInfo;
  storeItems: StoreItem[];
  storeLoading: boolean;
  storeError: string | null;
  currentUser: string | null;
  onRefreshStore: () => Promise<void>;
  onStoreError: (msg: string | null) => void;
}

const POLL_CHOICES = [
  '메인 요리가 제일 좋아요',
  '따뜻한 국·찌개가 최고예요',
  '디저트·음료가 기다려져요',
  '다음 주 특식 기대해요',
];

export const CommunityPage: React.FC<CommunityPageProps> = ({
  currentSchool,
  storeItems,
  storeLoading,
  storeError,
  currentUser,
  onRefreshStore,
  onStoreError,
}) => {
  const [postText, setPostText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingChoice, setVotingChoice] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Count poll votes from store items (type: 'vote')
  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    POLL_CHOICES.forEach((c) => {
      counts[c] = 0;
    });
    storeItems.forEach((item) => {
      if (item.data?.type === 'vote' && typeof item.data?.choice === 'string') {
        const ch = item.data.choice;
        if (ch in counts) {
          counts[ch] += 1;
        }
      }
    });
    return counts;
  }, [storeItems]);

  const totalVotes = useMemo(
    () => Object.values(voteCounts).reduce((sum, n) => sum + n, 0),
    [voteCounts]
  );

  // Filter posts (type: 'post')
  const posts = useMemo(() => {
    return storeItems
      .filter((item) => item.data?.type === 'post' && typeof item.data?.content === 'string')
      .slice()
      .reverse();
  }, [storeItems]);

  const handleVote = async (choice: string) => {
    setVotingChoice(choice);
    onStoreError(null);
    try {
      await store('add', {
        data: {
          type: 'vote',
          choice,
          schoolCode: currentSchool.SD_SCHUL_CODE,
          schoolName: currentSchool.SCHUL_NM,
        },
      });
      await onRefreshStore();
    } catch (err: any) {
      onStoreError(err?.message || '투표를 저장하지 못했어요.');
    } finally {
      setVotingChoice(null);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = postText.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    onStoreError(null);
    try {
      await store('add', {
        data: {
          type: 'post',
          schoolCode: currentSchool.SD_SCHUL_CODE,
          schoolName: currentSchool.SCHUL_NM,
          content: trimmed,
        },
      });
      setPostText('');
      await onRefreshStore();
    } catch (err: any) {
      onStoreError(err?.message || '글을 저장하지 못했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (item: StoreItem) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    onStoreError(null);
    try {
      await store('update', {
        id: item.id,
        data: {
          ...item.data,
          content: trimmed,
        },
      });
      setEditingId(null);
      setEditText('');
      await onRefreshStore();
    } catch (err: any) {
      onStoreError(err?.message || '글을 수정하지 못했어요.');
    }
  };

  const handleDeletePost = async (id: string) => {
    onStoreError(null);
    try {
      await store('delete', { id });
      await onRefreshStore();
    } catch (err: any) {
      onStoreError(err?.message || '글을 지우지 못했어요.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">급식 소통·투표</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            이번 주 급식에서 기대되는 메뉴에 투표하고 짧은 한줄평을 나눠 보세요.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefreshStore}
          disabled={storeLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${storeLoading ? 'animate-spin' : ''}`} />
          <span>새로 고침</span>
        </button>
      </div>

      {/* Store Error Banner */}
      {storeError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{storeError}</span>
        </div>
      )}

      {/* Poll Section (type: 'vote') */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            이번 주 급식, 무엇이 제일 기대되나요?
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            총 {totalVotes}표
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {POLL_CHOICES.map((choice) => {
            const count = voteCounts[choice] || 0;
            const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const isVoting = votingChoice === choice;

            return (
              <button
                key={choice}
                type="button"
                disabled={Boolean(votingChoice)}
                onClick={() => handleVote(choice)}
                className="relative overflow-hidden p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white text-left transition-all group disabled:opacity-60"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-emerald-50/90 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
                <div className="relative flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-800">{choice}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 shrink-0">
                    {isVoting ? '투표 중...' : `${count}표 (${percent}%)`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Post Board Section (type: 'post') */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          급식 한줄평 ({posts.length})
        </h3>

        <form onSubmit={handleAddPost} className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              maxLength={120}
              placeholder={`${currentSchool.SCHUL_NM} 급식에 대한 한줄평을 남겨 보세요`}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isSubmitting || !postText.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? '저장 중' : '등록'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            이름 · 학번 · 연락처는 쓰지 마세요
          </p>
        </form>

        {storeLoading && posts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            저장소에서 한줄평을 불러오는 중...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
            아직 남겨진 한줄평이 없어요. 첫 번째 한줄평을 작성해 보세요!
          </div>
        ) : (
          <ul className="space-y-2.5">
            {posts.map((item) => {
              const canManage = Boolean(currentUser && item.user && item.user === currentUser);
              const isEditing = editingId === item.id;

              return (
                <li
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {String(item.data.schoolName || '우리 학교')}
                      </span>
                      {item.user && (
                        <span className="font-medium text-slate-700">{item.user}</span>
                      )}
                    </div>
                    <span>{item.time ? String(item.time).slice(0, 16) : ''}</span>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        maxLength={120}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item)}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        title="저장"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditText('');
                        }}
                        className="p-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
                        title="취소"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed break-words">
                        {String(item.data.content)}
                      </p>
                      {canManage && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(item.id);
                              setEditText(String(item.data.content));
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                            title="고치기"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePost(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="지우기"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};
