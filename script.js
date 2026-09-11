 (function(){
    var items = Array.prototype.slice.call(document.querySelectorAll('#galGrid .gal-item'));
    if (!items.length) return;
    var lightbox = document.getElementById('galLightbox');
    var imgEl = document.getElementById('galLightboxImg');
    var placeholderEl = document.getElementById('galLightboxPlaceholder');
    var titleEl = document.getElementById('galLightboxTitle');
    var descEl = document.getElementById('galLightboxDesc');
    var counterEl = document.getElementById('galLightboxCounter');
    var closeBtn = document.getElementById('galLightboxClose');
    var prevBtn = document.getElementById('galLightboxPrev');
    var nextBtn = document.getElementById('galLightboxNext');
    var current = 0;
    var lastFocused = null;

    function render(){
      var el = items[current];
      var title = el.querySelector('.gal-cap-title').textContent;
      var desc = el.querySelector('.gal-cap-desc').textContent;
      var srcImg = el.querySelector('img');
      if (srcImg) {
        imgEl.src = srcImg.currentSrc || srcImg.src;
        imgEl.alt = srcImg.alt || title;
        imgEl.style.display = 'block';
        placeholderEl.style.display = 'none';
      } else {
        imgEl.removeAttribute('src');
        imgEl.style.display = 'none';
        placeholderEl.style.display = 'flex';
      }
      titleEl.textContent = title;
      descEl.textContent = desc;
      counterEl.textContent = (current + 1) + ' / ' + items.length;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === items.length - 1;
    }
    function open(index){
      current = index;
      lastFocused = document.activeElement;
      render();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
      document.addEventListener('keydown', onKeydown);
    }
    function close(){
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused) lastFocused.focus();
    }
    function go(delta){
      var next = current + delta;
      if (next < 0 || next >= items.length) return;
      current = next;
      render();
    }
    function onKeydown(e){
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    }

    items.forEach(function(el, i){
      el.addEventListener('click', function(){ open(i); });
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function(){ go(-1); });
    nextBtn.addEventListener('click', function(){ go(1); });
    lightbox.addEventListener('click', function(e){ if (e.target === lightbox) close(); });
  })();

  (function(){
    var media = document.getElementById('compareMedia');
    var afterImg = document.getElementById('compareAfter');
    var handle = document.getElementById('compareHandle');
    if (!media || !afterImg || !handle) return;
    var dragging = false;

    function setPct(pct){
      pct = Math.min(100, Math.max(0, pct));
      afterImg.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
      media.setAttribute('aria-valuenow', Math.round(pct));
    }
    function pctFromEvent(e){
      var rect = media.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return (x / rect.width) * 100;
        }
    media.addEventListener('pointerdown', function(e){
      dragging = true;
      media.setPointerCapture(e.pointerId);
      setPct(pctFromEvent(e));
    });
    media.addEventListener('pointermove', function(e){
      if (!dragging) return;
      setPct(pctFromEvent(e));
    });
    media.addEventListener('pointerup', function(){ dragging = false; });
    media.addEventListener('pointercancel', function(){ dragging = false; });
    media.addEventListener('keydown', function(e){
      var current = parseFloat(media.getAttribute('aria-valuenow')) || 50;
      if (e.key === 'ArrowLeft'){ setPct(current - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight'){ setPct(current + 5); e.preventDefault(); }
    });

	("use strict");

	var DATA_URL = "skills.json";

	var DATA = {
		skillsHeader: "Skills Header",
		skillsDesc: "This is the skills description",
		skills: [
			{
				skillName: "Stakeholder Alignment",
				skillDesc:
					"Facilitated Discovery, Requirements Analysis, Stakeholder Interviews, Iterative Design, and Design Reviews to align business objectives with user needs."
			},
			{
				skillName: "Content Inventory",
				skillDesc:
					"Conducted comprehensive content inventories to catalog existing digital assets, assess content structure and quality, and establish a foundation for information architecture and migration."
			},
			{
				skillName: "Taxonomy",
				skillDesc:
					"Developed content taxonomies and classification structures to organize information, improve findability, and establish consistent relationships across the system."
			},
			{
				skillName: "User Personas",
				skillDesc:
					"Conducted persona development to establish user profiles, define key goals and behaviors, and inform the overall UX and information architecture."
			},
			{
				skillName: "User Flows",
				skillDesc:
					"Designed User Flows and interaction patterns to simplify complex workflows"
			},
			{
				skillName: "Wireframes",
				skillDesc:
					"Created Wireframes to define page structure, functionality, and user interactions"
			},
			{
				skillName: "Interactive Prototypes",
				skillDesc:
					"Developed Interactive Prototypes to validate concepts and communicate design solutions"
			},
			{
				skillName: "Sitemaps",
				skillDesc:
					"Developed Site Architecture and Sitemaps to define content hierarchy, navigation, and overall digital structure"
			}
		],
		tags: [
			{ tagName: "Stakeholder Alignment" },
			{ tagName: "Business Requirements" },
			{ tagName: "Functional Specifications" },
			{ tagName: "Wireframes" },
			{ tagName: "Storyboards" },
			{ tagName: "Hi / Lo-Fidelity Prototyping" },
			{ tagName: "Use-Case & Scenarios" },
			{ tagName: "Sitemaps" },
			{ tagName: "Taxonomies" },
			{ tagName: "SEO" }
		]
	};

	var $1 = function (sel) {
		return document.querySelector(sel);
	};

	// Null-safe: this pen has no #header / #description / #source, and the
	// old code threw on the first one it touched.
	function setText(sel, value) {
		var el = $1(sel);
		if (el) el.textContent = value;
	}

	function parseLoose(text) {
		try {
			return JSON.parse(text);
		} catch (e) {
			return JSON.parse(text.replace(/,(\s*[}\]])/g, "$1"));
		}
	}

	function decodeEntities(str) {
		var el = document.createElement("textarea");
		el.innerHTML = String(str);
		return el.value;
	}

	function render(data) {
		var skills = Array.isArray(data.skills) ? data.skills : [];
		var tags = Array.isArray(data.tags) ? data.tags : [];

		// Optional — only written if those elements exist in the markup.
		setText("#header", data.skillsHeader || "");
		setText("#description", data.skillsDesc || "");

		var stepsEl = $1(".steps");
		var tagsEl = $1(".skill-tags");

		if (tagsEl) {
			tagsEl.textContent = "";
			tags.forEach(function (tag, i) {
				var span = document.createElement("span");
				span.className = "tag";
				span.style.animationDelay = i * 45 + "ms";
				span.textContent = decodeEntities(tag.tagName || "");
				tagsEl.appendChild(span);
			});
		}

		if (stepsEl) {
			stepsEl.textContent = "";
			skills.forEach(function (skill, i) {
				var card = document.createElement("div");
				card.className = "card";
				card.style.animationDelay = i * 70 + "ms";

				var num = document.createElement("div");
				num.className = "num";
				num.textContent = String(i + 1).padStart(2, "0");

				var title = document.createElement("div");
				title.className = "title";
				title.textContent = decodeEntities(skill.skillName || "");

				var desc = document.createElement("div");
				desc.className = "desc";
				desc.textContent = decodeEntities(skill.skillDesc || "");

				card.appendChild(num);
				card.appendChild(title);
				card.appendChild(desc);
				stepsEl.appendChild(card);
			});
		}

		if (!stepsEl && !tagsEl) {
			console.warn(
				"[skills] No .steps or .skill-tags container found in the markup."
			);
		}
	}

	function start() {
		if (!DATA_URL) {
			render(DATA);
			return;
		}

		fetch(DATA_URL, { cache: "no-store" })
			.then(function (res) {
				if (!res.ok) throw new Error("HTTP " + res.status);
				var type = res.headers.get("content-type") || "";
				if (type.indexOf("html") !== -1)
					throw new Error("got HTML, not JSON — bad path?");
				return res.text();
			})
			.then(function (text) {
				render(parseLoose(text));
			})
			.catch(function (err) {
				console.warn(
					"[skills] " +
						DATA_URL +
						" failed (" +
						err.message +
						") — using inline data."
				);
				render(DATA);
			});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", start);
	} else {
		start();
	}
})();
