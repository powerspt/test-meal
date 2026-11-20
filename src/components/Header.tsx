import React from 'react';
import { NavLink } from 'react-router-dom';
import { SchoolInfo } from '../types';
import {
  Utensils,
  Search,
  ShieldAlert,
  Share2,
  Check,
  Star,
  MessageSquareHeart,
  HelpCircle,
  CalendarDays,
} from 'lucide-react';

interface HeaderProps {
  currentSchool: SchoolInfo;
  isFavoriteSchool: boolean;
  onToggleFavoriteSchool: () => void;
  onOpenSchoolSearch: () => void;
  userAllergiesCount: number;
  onOpenAllergyModal: () => void;
  onShareMeals: () => void;
  copied: boolean;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSchool,
  isFavoriteSchool,
  onToggleFavoriteSchool,
  onOpenSchoolSearch,
  userAllergiesCount,
  onOpenAllergyModal,
  onShareMeals,
  copied,
  favoritesCount,
}) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
      isActive
        ? 'bg-emerald-600 text-white shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Brand & Mobile School Selector */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                    이번 주 급식
                  </h1>
                  <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    NEIS 연동
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  우리 학교 이번 주 식단 & 영양 정보
                </p>
              </div>
            </NavLink>

            {/* Mobile School Selector + Favorite Toggle */}
            <div className="flex sm:hidden items-center gap-1.5">
              <button
                id="mobile-favorite-school-btn"
                onClick={onToggleFavoriteSchool}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isFavoriteSchool
                    ? 'bg-amber-50 border-amber-300 text-amber-500'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500'
                }`}
                title={isFavoriteSchool ? '즐겨찾기 학교 해제' : '이 학교 즐겨찾기 추가'}
                aria-label="학교 즐겨찾기"
              >
                <Star className={`w-4 h-4 ${isFavoriteSchool ? 'fill-amber-400' : ''}`} />
              </button>
              <button
                id="mobile-school-selector-btn"
                onClick={onOpenSchoolSearch}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
              >
                <span className="truncate max-w-[110px]">{currentSchool.SCHUL_NM}</span>
                <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 justify-end flex-wrap">
            {/* Desktop School Selector + Favorite Star */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                id="desktop-school-selector-btn"
                onClick={onOpenSchoolSearch}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 text-slate-800 text-xs font-medium transition-all group"
                title="다른 학교 식단표 검색"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold text-slate-900">{currentSchool.SCHUL_NM}</span>
                <span className="text-[11px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {currentSchool.SCHUL_KND_SC_NM || '학교'}
                </span>
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors ml-0.5" />
              </button>

              <button
                id="desktop-favorite-school-btn"
                onClick={onToggleFavoriteSchool}
                className={`p-2 rounded-xl border transition-all ${
                  isFavoriteSchool
                    ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                }`}
                title={isFavoriteSchool ? '즐겨찾기 학교 해제' : '이 학교 즐겨찾기 추가'}
                aria-label="학교 즐겨찾기"
              >
                <Star className={`w-4 h-4 ${isFavoriteSchool ? 'fill-amber-400 text-amber-500' : ''}`} />
              </button>
            </div>

            {/* Allergy Settings Filter */}
            <button
              id="allergy-filter-btn"
              onClick={onOpenAllergyModal}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                userAllergiesCount > 0
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="알레르기 주의 필터 설정"
            >
              <ShieldAlert
                className={`w-4 h-4 ${
                  userAllergiesCount > 0 ? 'text-amber-600' : 'text-slate-400'
                }`}
              />
              <span>알레르기</span>
              {userAllergiesCount > 0 ? (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">
                  {userAllergiesCount}
                </span>
              ) : (
                <span className="text-slate-400 text-[11px]">설정</span>
              )}
            </button>

            {/* Share / Copy Button */}
            <button
              id="share-meals-btn"
              onClick={onShareMeals}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              title="이번 주 식단표 텍스트 복사"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">복사완료!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">식단 공유</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (HashRouter) */}
        <nav className="flex items-center gap-1.5 pt-1 border-t border-slate-100 overflow-x-auto scrollbar-none">
          <NavLink to="/" end className={navLinkClass}>
            <CalendarDays className="w-3.5 h-3.5" />
            <span>이번 주 급식</span>
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass}>
            <Star className="w-3.5 h-3.5" />
            <span>즐겨찾기</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {favoritesCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/community" className={navLinkClass}>
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>급식 소통·투표</span>
          </NavLink>
          <NavLink to="/faq" className={navLinkClass}>
            <HelpCircle className="w-3.5 h-3.5" />
            <span>급식 도우미</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
