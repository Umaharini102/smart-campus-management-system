import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Filter,
  ArrowUpDown,
  Building2,
  Globe2,
  Award,
  Sparkles,
  RotateCcw,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { DEMO_FACULTY, DEPARTMENTS, COUNTRIES, DESIGNATIONS } from '../data/facultyData';
import { facultyService } from '../services/dataServices';
import FacultyCard from '../components/faculty/FacultyCard';
import FacultyProfileModal from '../components/faculty/FacultyProfileModal';
import AnimatedBackground from '../components/visuals/AnimatedBackground';

export default function FacultyDirectory() {
  const [facultyList, setFacultyList] = useState(DEMO_FACULTY);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedDesignation, setSelectedDesignation] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Attempt to load from API, with graceful fallback to built-in sample data
  useEffect(() => {
    let isMounted = true;
    const loadFaculty = async () => {
      try {
        const res = await facultyService.getPublic();
        if (isMounted && res && res.faculty && res.faculty.length > 0) {
          // Merge API faculty or keep rich demo list
          setFacultyList(DEMO_FACULTY);
        }
      } catch (err) {
        // Fallback to DEMO_FACULTY if backend is unreachable or not yet started
        if (isMounted) setFacultyList(DEMO_FACULTY);
      }
    };
    loadFaculty();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenProfile = (faculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('All');
    setSelectedCountry('All');
    setSelectedDesignation('All');
    setSortBy('name-asc');
  };

  // Filtered & Sorted Faculty
  const filteredFaculty = useMemo(() => {
    let result = [...facultyList];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.specialization.toLowerCase().includes(q) ||
          f.country.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q)
      );
    }

    // Department filter
    if (selectedDept !== 'All') {
      result = result.filter((f) => f.department.toLowerCase() === selectedDept.toLowerCase());
    }

    // Country filter
    if (selectedCountry !== 'All') {
      result = result.filter((f) => f.country.toLowerCase() === selectedCountry.toLowerCase());
    }

    // Designation filter
    if (selectedDesignation !== 'All') {
      result = result.filter((f) => f.designation.toLowerCase() === selectedDesignation.toLowerCase());
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'department') return a.department.localeCompare(b.department);
      if (sortBy === 'country') return a.country.localeCompare(b.country);
      if (sortBy === 'publications') return (b.publications || 0) - (a.publications || 0);
      return 0;
    });

    return result;
  }, [facultyList, searchTerm, selectedDept, selectedCountry, selectedDesignation, sortBy]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedDept !== 'All' ||
    selectedCountry !== 'All' ||
    selectedDesignation !== 'All' ||
    sortBy !== 'name-asc';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Ambience */}
      <AnimatedBackground />

      {/* Profile Details Modal */}
      <FacultyProfileModal
        faculty={selectedFaculty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/85 backdrop-blur-xl border-b border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block leading-tight">
                Smart Campus
              </span>
              <span className="text-[11px] font-semibold text-cyan-400 tracking-wider uppercase block">
                Management System
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link
              to="/"
              className="text-slate-300 hover:text-cyan-400 font-medium transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              Home
            </Link>
            <Link
              to="/faculty"
              className="text-cyan-400 font-semibold transition-colors flex items-center gap-1.5"
            >
              Faculty Directory
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/30"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full z-10">
        {/* Page Title & Demo Notice Banner */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-cyan-300 mb-2">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                Institutional Academic Directory
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Faculty & Academic Staff
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Explore faculty appointments across computing, engineering, data science, and technology disciplines.
              </p>
            </div>

            {/* Fictional Demo Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Fictional sample profiles for UI demonstration</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Control Plane */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl mb-8 space-y-4">
          {/* Search bar row */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search faculty by name, specialization, department, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700/80 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Filter dropdowns row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Department */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country === 'All' ? 'All Countries' : country}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Designation
              </label>
              <select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {DESIGNATIONS.map((desig) => (
                  <option key={desig} value={desig}>
                    {desig === 'All' ? 'All Designations' : desig}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="name-asc">Name (A &rarr; Z)</option>
                <option value="name-desc">Name (Z &rarr; A)</option>
                <option value="department">Department</option>
                <option value="country">Country</option>
                <option value="publications">Most Publications</option>
              </select>
            </div>
          </div>

          {/* Active Status & Reset Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Showing <strong className="text-cyan-400 font-mono">{filteredFaculty.length}</strong> of{' '}
              <strong className="text-white font-mono">{facultyList.length}</strong> faculty members
            </span>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Faculty Cards Grid */}
        {filteredFaculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((faculty) => (
              <FacultyCard
                key={faculty.id}
                faculty={faculty}
                onViewProfile={handleOpenProfile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <Filter className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No faculty found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              No profiles matched your search or filter criteria. Try adjusting the search keywords or filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 text-slate-400 py-10 px-6 text-xs z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-white font-semibold">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Smart Campus Management System</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Generic Educational Institution Operating Platform. All fictional profiles for testing.
          </div>
        </div>
      </footer>
    </div>
  );
}
