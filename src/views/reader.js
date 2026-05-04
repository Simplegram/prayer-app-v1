import { db } from '../db.js';
import { Swiper } from 'swiper/bundle';

import 'swiper/swiper-bundle.css';

let swiperInstance = null;

export function render(root, collectionId, collectionType = 'subfolder') {
  const container = document.createElement('div');
  container.className = 'fixed inset-0 bg-cream z-50 flex flex-col';

  const header = document.createElement('header');
  header.className = 'bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0';

  const navRow = document.createElement('div');
  navRow.className = 'flex items-center justify-between';

  const backBtn = document.createElement('button');
  backBtn.id = 'reader-back';
  backBtn.className = 'flex items-center gap-2 px-4 py-3 text-xl font-bold bg-white border-2 border-gray-300 rounded-lg min-h-[60px]';
  backBtn.innerHTML = '<span aria-hidden="true">&#8592;</span> Back';

  const prayerCounter = document.createElement('span');
  prayerCounter.id = 'prayer-counter';
  prayerCounter.className = 'text-xl font-semibold text-gray-600';
  prayerCounter.textContent = '';

  const dummyBtn = document.createElement('div');
  dummyBtn.className = 'w-[60px] h-[60px]';

  navRow.appendChild(backBtn);
  navRow.appendChild(prayerCounter);
  navRow.appendChild(dummyBtn);
  header.appendChild(navRow);

  const titleBar = document.createElement('div');
  titleBar.id = 'reader-title';
  titleBar.className = 'text-center text-4xl font-bold px-4 py-2 border-b border-gray-100';

  header.appendChild(titleBar);
  container.appendChild(header);

  const swiperContainer = document.createElement('div');
  swiperContainer.className = 'flex-1 overflow-hidden';

  const swiperEl = document.createElement('div');
  swiperEl.className = 'swiper w-full h-full';

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';

  swiperEl.appendChild(wrapper);
  swiperContainer.appendChild(swiperEl);
  container.appendChild(swiperContainer);

  const navBar = document.createElement('div');
  navBar.className = 'bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-center gap-6 flex-shrink-0';

  const prevBtn = document.createElement('button');
  prevBtn.id = 'swiper-prev';
  prevBtn.className = 'w-[80px] h-[64px] bg-blue-600 text-white text-3xl font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center';
  prevBtn.innerHTML = '&#8592;';

  const nextBtn = document.createElement('button');
  nextBtn.id = 'swiper-next';
  nextBtn.className = 'w-[80px] h-[64px] bg-blue-600 text-white text-3xl font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center';
  nextBtn.innerHTML = '&#8594;';

  navBar.appendChild(prevBtn);
  navBar.appendChild(nextBtn);
  container.appendChild(navBar);

  root.appendChild(container);

  loadPrayers();

  async function loadPrayers() {
    try {
      const prayers = collectionType === 'folder'
        ? await db.prayers.where('folderId').equals(collectionId).toArray()
        : await db.prayers.where('subfolderId').equals(collectionId).toArray();

      if (prayers.length === 0) {
        wrapper.innerHTML = `
          <div class="swiper-slide flex items-center justify-center">
            <p class="text-2xl text-gray-500 text-center px-8">No prayers to display.</p>
          </div>`;

        swiperInstance = new Swiper(swiperEl, {
          initialSlide: 0,
        });

        backBtn.addEventListener('click', () => { window.history.back(); });
        return;
      }

      prayers.forEach((prayer, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'h-full overflow-y-auto px-6 py-8 flex flex-col';

        const bodyEl = document.createElement('div');
        bodyEl.className = 'prayer-text text-black leading-relaxed flex-1 whitespace-pre-wrap';
        bodyEl.textContent = prayer.content;

        contentDiv.appendChild(bodyEl);
        slide.appendChild(contentDiv);
        wrapper.appendChild(slide);

        if (index === 0) {
          document.getElementById('reader-title').textContent = prayer.title;
        }
      });

      document.getElementById('prayer-counter').textContent = `1 / ${prayers.length}`;

      swiperInstance = new Swiper(swiperEl, {
        initialSlide: 0,
        speed: 300,
        on: {
          slideChange: function () {
            const idx = this.activeIndex;
            document.getElementById('reader-title').textContent = prayers[idx].title;
            document.getElementById('prayer-counter').textContent = `${idx + 1} / ${prayers.length}`;

            prevBtn.disabled = idx === 0;
            nextBtn.disabled = idx === prayers.length - 1;

            prevBtn.classList.toggle('opacity-50', idx === 0);
            nextBtn.classList.toggle('opacity-50', idx === prayers.length - 1);
          },
        },
      });

      prevBtn.addEventListener('click', () => { swiperInstance?.slidePrev(); });
      nextBtn.addEventListener('click', () => { swiperInstance?.slideNext(); });

      prevBtn.classList.add('opacity-50');
    } catch (err) {
      wrapper.innerHTML = `
        <div class="swiper-slide flex items-center justify-center">
          <p class="text-2xl text-red-600 text-center px-8">Error loading prayers.</p>
        </div>`;

      swiperInstance = new Swiper(swiperEl, {});
    }

    backBtn.addEventListener('click', () => { window.history.back(); });
  }

  return function cleanup() {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
  };
}
