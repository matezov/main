#ifndef ALIGNER__H
#define ALIGNER__H

#include <list>
#include <vector>
#include <iterator>
#include <algorithm>

template <typename T>
class aligner {
	public:
		aligner() : filler() { }
		virtual ~aligner() {
			
		}
		
		int count() const {
			return vectors.size();
		}

		void add(std::vector<T>& vec) {
			vectors.push_back(&vec);
		}

		void set_filler(T filler) { 
			this->filler = filler;
		}
		
		virtual void align() = 0;

	protected:
		std::list<std::vector<T>* > vectors;
		T filler;
		
		int maxSize() const {
			int max = 0;
			for (typename std::list<std::vector<T>* >::const_iterator it = vectors.begin(); it != vectors.end(); ++it) {
				int n = (*it)->size();
				if (max < n) {
					max = n;
				}
			}
			return max;
		}
};

template <typename T>
class center_aligner : public aligner<T> {
	public:
		center_aligner() { }
		~center_aligner() { }

		void align() {
			int maxSize = aligner<T>::maxSize();
			for (typename std::list<std::vector<T>* >::iterator it = aligner<T>::vectors.begin(); it != aligner<T>::vectors.end(); ++it) {
				int n = (*it)->size();
				int m = (maxSize - n) / 2;
				if (n < maxSize) {
					for (int i = 0; i < maxSize - n; ++i) {
						(*it)->push_back(aligner<T>::filler);				
					}
					for (int i = n - 1; i >= 0; --i) {
						std::swap(((*it)->at(i)), ((*it)->at(i + m)));
					}
				}
			}
		}
};

template <typename T>
class left_aligner : public aligner<T> {
	public:
		left_aligner() { }
		~left_aligner() { }

		void align() {
			int maxSize = aligner<T>::maxSize();
			for (typename std::list<std::vector<T>* >::iterator it = aligner<T>::vectors.begin(); it != aligner<T>::vectors.end(); ++it) {
				int n = (*it)->size();
				if (n < maxSize) {
					int n = maxSize - (*it)->size();
					for (int i = 0; i < n; ++i) {
						(*it)->push_back(aligner<T>::filler);
					}
				}
			}
		}
};

template <typename T>
class right_aligner : public aligner<T> {
	public:
		right_aligner() { }
		~right_aligner() { }
		
		void align() {
			int maxSize = aligner<T>::maxSize();
			for (typename std::list<std::vector<T>* >::iterator it = aligner<T>::vectors.begin(); it != aligner<T>::vectors.end(); ++it) {
				int n = (*it)->size();
				int m = maxSize - n;
				if (n < maxSize) {
					for (int i = 0; i < maxSize - n; ++i) {
						(*it)->push_back(aligner<T>::filler);
					}
					for (int i = n - 1; i >= 0; --i) {
						std::swap((*it)->at(i), (*it)->at(i + m));
					}
				}
			}
		}
};

template <typename T>
class justified_aligner : public aligner<T> {
	public:
		justified_aligner() { }
		~justified_aligner() { }

		void align() {
			int maxSize = aligner<T>::maxSize();
			for (typename std::list<std::vector<T>* >::iterator it = aligner<T>::vectors.begin(); it != aligner<T>::vectors.end(); ++it) {
				int n = (*it)->size();
				if (n < maxSize) {
					for (int i = 0; i < maxSize - n; ++i) {
						(*it)->push_back(aligner<T>::filler);
					}
					if (n == 2) {
						std::swap((*it)->at(1), (*it)->at(1 + maxSize - n));
					}
					if (maxSize % 2 == 1) {
						if (n == 1) {
							std::swap((*it)->at(0), (*it)->at(maxSize / 2));
						}
						if (n == 3) {
							std::swap((*it)->at(2), (*it)->at(maxSize - 1));
							std::swap((*it)->at(1), (*it)->at(maxSize / 2));
						}
					}
					if (maxSize % 2 == 1 && n != 1 && n != 2 && n != 3) {
						if (n % 2 == 1 && maxSize - n == maxSize / 2) {
							int j = 0; 
							for (int i = n - 1; i > 0; --i) {
								std::swap((*it)->at(i), (*it)->at(maxSize - j - 1));
								j += maxSize / n + 1;
							}
						}
					}
				}
			}
		}
};

#endif



