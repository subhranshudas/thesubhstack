const DATA = {
  initialPrompt: "npx thesubhstack@latest",
  loadingText: "Downloading portfolio...",
  sections: [
    {
      id: "about",
      title: "About Me",
      content:
        "Hi! I'm a passionate developer who loves creating elegant solutions to complex problems. I specialize in full-stack web development and have a keen interest in artificial intelligence.",
    },
    {
      id: "skills",
      title: "Skillset",
      content: [
        "JavaScript/TypeScript",
        "React/Next.js",
        "Tailwind CSS",
        "Node.js/Express",
        "Python/FastAPI",
        "PostgreSQL/MongoDB",
        "AWS/Docker",
        "Git/CI/CD",
      ],
    },
    {
      id: "projects",
      title: "Public Projects",
      content: [
        // {
        //   name: "Project 1",
        //   url: "https://github.com/username/project1",
        //   description: "A React-based task manager",
        // },
        // {
        //   name: "Project 2",
        //   url: "https://github.com/username/project2",
        //   description: "Python automation toolkit",
        // },
        // {
        //   name: "Project 3",
        //   url: "https://github.com/username/project3",
        //   description: "Node.js API framework",
        // },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      email: "subhstack@gmail.com",
    },
  ],
};

class TerminalPortfolio {
  constructor() {
    this.currentSection = -1;
    this.currentLink = -1;
    this.sections = [];
    this.data = DATA;
    this.init();
  }

  init() {
    this.simulateTyping();
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }

  simulateTyping() {
    const command = this.data.initialPrompt;
    const output = document.getElementById("output");

    // Set up initial HTML structure
    output.innerHTML = `<div class="input-line">
        <span class="prompt">&gt;</span>
        <span class="command"></span>
        <span class="cursor">▮</span>
    </div>`;

    // Get references to elements
    const inputLine = output.querySelector(".input-line");
    const commandSpan = inputLine.querySelector(".command");
    const cursor = inputLine.querySelector(".cursor");

    let currentText = "";
    let charIndex = 0;

    // Type out each character with random variation
    const typeInterval = setInterval(() => {
      if (charIndex < command.length) {
        currentText += command[charIndex];
        commandSpan.textContent = currentText;
        charIndex++;
        // Add random variation to typing speed
        clearInterval(typeInterval);
        setTimeout(() => {
          this.simulateNextChar(
            currentText,
            charIndex,
            command,
            commandSpan,
            cursor,
            output
          );
        }, Math.random() * 50 + 150); // Random delay between 150-200ms
      } else {
        this.startBlinking(cursor, command, output);
      }
    }, 200); // Base typing speed of 200ms
  }

  simulateNextChar(
    currentText,
    charIndex,
    command,
    commandSpan,
    cursor,
    output
  ) {
    if (charIndex < command.length) {
      const typeInterval = setInterval(() => {
        if (charIndex < command.length) {
          currentText += command[charIndex];
          commandSpan.textContent = currentText;
          charIndex++;
        }
        clearInterval(typeInterval);
        setTimeout(() => {
          this.simulateNextChar(
            currentText,
            charIndex,
            command,
            commandSpan,
            cursor,
            output
          );
        }, Math.random() * 50 + 150);
      }, 200);
    } else {
      this.startBlinking(cursor, command, output);
    }
  }

  startBlinking(cursor, command, output) {
    let blinkCount = 0;
    cursor.classList.remove("blink");

    const blinkInterval = setInterval(() => {
      cursor.style.visibility =
        cursor.style.visibility === "hidden" ? "visible" : "hidden";
      blinkCount++;

      if (blinkCount >= 6) {
        clearInterval(blinkInterval);
        cursor.style.visibility = "visible";

        setTimeout(() => {
          output.innerHTML = `<div>&gt;${command}</div>`;
          setTimeout(() => this.startLoading(), 100);
        }, 200);
      }
    }, 250);
  }

  startLoading() {
    const output = document.getElementById("output");
    output.innerHTML = `
        <div>${this.data.loadingText}</div>
        <div class="loading-bar">
            <div class="loading-progress"></div>
        </div>
    `;

    const progress = document.querySelector(".loading-progress");

    // Start at 0%
    progress.style.width = "0%";
    progress.offsetHeight; // Force reflow

    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => this.showContent(), 200);
      } else {
        currentProgress += 2;
        progress.style.width = `${currentProgress}%`;
      }
    }, 40);
  }

  showContent() {
    let contentHTML = "";

    this.data.sections.forEach((section) => {
      contentHTML += `<div class="section" data-section="${section.id}">
                <div class="section-title">${section.title}</div>
                <div>${this.formatSectionContent(section)}</div>
            </div>`;
    });

    contentHTML += `
            <div class="help-text" style="color: #666; margin-top: 20px; font-size: 0.9em;">
                Use ↑↓ arrow keys to navigate, Enter to select
            </div>
            <div class="input-line">
                <span class="prompt">&gt;</span>
                <span class="cursor blink">▮</span>
            </div>
        `;

    const output = document.getElementById("output");
    output.innerHTML = contentHTML;

    this.sections = document.querySelectorAll(".section");
    this.currentSection = 0;
    this.updateSelection();
  }

  formatSectionContent(section) {
    switch (section.id) {
      case "skills":
        return section.content.map((skill) => `• ${skill}`).join("<br>");

      case "projects":
        if (!section.content || section.content.length === 0) {
          return "Coming soon...";
        }
        return section.content
          .map(
            (project) =>
              `• <a href="${project.url}">${project.name}</a> - ${project.description}`
          )
          .join("<br>");

      case "contact":
        return `Get in touch: <a href="mailto:${section.email}">${section.email}</a>`;

      default:
        return section.content;
    }
  }

  handleKeyPress(e) {
    if (!this.sections.length) return;

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        this.moveSelection(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        this.moveSelection(1);
        break;
      case "Enter":
        e.preventDefault();
        this.handleEnterKey();
        break;
    }
  }

  handleEnterKey() {
    if (this.currentSection >= 0 && this.currentLink >= 0) {
      const currentSection = this.sections[this.currentSection];
      const links = currentSection.querySelectorAll("a");
      if (links[this.currentLink]) {
        links[this.currentLink].click();
      }
    }
  }

  moveSelection(direction) {
    const currentSection = this.sections[this.currentSection];
    const links = currentSection?.querySelectorAll("a");

    // Moving up from a section with links
    if (
      direction === -1 &&
      this.currentLink === -1 &&
      this.currentSection > 0
    ) {
      // Move to previous section
      this.currentSection--;
      // If previous section has links, select its last link
      const prevLinks =
        this.sections[this.currentSection].querySelectorAll("a");
      this.currentLink = prevLinks.length > 0 ? prevLinks.length - 1 : -1;
    }
    // If we're in a section with links
    else if (links?.length && this.currentLink >= -1) {
      // Moving within links
      this.currentLink += direction;

      // If moving up from first link, move to section
      if (this.currentLink < 0) {
        this.currentLink = -1;
      }
      // If moving down past last link, move to next section
      else if (
        this.currentLink >= links.length &&
        this.currentSection < this.sections.length - 1
      ) {
        // Only move to next section if we're not in the last section
        this.currentLink = -1;
        this.currentSection = Math.min(
          this.sections.length - 1,
          this.currentSection + 1
        );
      }
      // If we're at the last link of the last section, stay there
      else if (this.currentLink >= links.length) {
        this.currentLink = links.length - 1;
      }
    } else {
      // Moving between sections
      this.currentSection = Math.max(
        0,
        Math.min(this.sections.length - 1, this.currentSection + direction)
      );
      this.currentLink = -1; // Reset link selection
    }

    this.updateSelection();
  }

  updateSelection() {
    this.sections.forEach((section, index) => {
      // Remove all selections first
      section.classList.remove("selected");
      section
        .querySelectorAll("a")
        .forEach((link) => link.classList.remove("selected"));

      if (index === this.currentSection) {
        // If no link is selected, highlight the whole section
        if (this.currentLink === -1) {
          section.classList.add("selected");
        } else {
          // Otherwise, highlight the specific link
          const links = section.querySelectorAll("a");
          if (links[this.currentLink]) {
            links[this.currentLink].classList.add("selected");
          }
        }
      }
    });
  }
}

new TerminalPortfolio();
