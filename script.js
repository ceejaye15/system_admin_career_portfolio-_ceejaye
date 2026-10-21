const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
const navLinks = [...document.querySelectorAll('.nav-link')];

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const observedSections = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const matchingLink = navLinks.find(link => link.getAttribute('href') === `#${entry.target.id}`);
    if (!matchingLink) return;

    navLinks.forEach(link => {
      const isActive = link === matchingLink;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-24% 0px -64% 0px' });

observedSections.forEach(section => sectionObserver.observe(section));

const scenarios = {
  'shared-folder': {
    label: 'CASE 01 / ACCESS & PERMISSIONS',
    title: 'An employee cannot open a shared folder.',
    context: 'They can sign in normally, but the folder shows an “access denied” message. Other team members can open it.',
    steps: [
      {
        prompt: 'What is the safest useful first check?',
        correct: 0,
        choices: [
          { label: 'Check the user and group permissions for this folder.', feedback: 'Good first check. The “access denied” message and the fact that teammates can open the folder point toward an account or permission difference. Confirm the user and group before changing access.' },
          { label: 'Restart the entire file server immediately.', feedback: 'That is a broad, disruptive change, and other users can still access the folder. First narrow down whether this is a user-specific permission issue.' },
          { label: 'Replace the employee’s computer.', feedback: 'There is not enough evidence to blame the device. Check the account, exact error, and whether this user can reach other shared resources first.' }
        ]
      },
      {
        prompt: 'The user is not in the folder’s approved access group. What next?',
        correct: 1,
        choices: [
          { label: 'Add the user directly to every access list without approval.', feedback: 'Avoid bypassing the organization’s access process. Confirm the user’s need and follow the approved request or authorization workflow.' },
          { label: 'Verify the user is authorized, then request the approved group change.', feedback: 'Exactly. Confirm the business need, follow the access approval process, and make the smallest authorized change. Then have the user test again.' },
          { label: 'Turn off permissions for the whole folder.', feedback: 'That would expose data and affect everyone. Keep access controls in place and address only the authorized user or group.' }
        ]
      },
      {
        prompt: 'The approved group change is in place. How do you close the case?',
        correct: 2,
        choices: [
          { label: 'Assume it worked and close the ticket immediately.', feedback: 'A change is not verified until the user confirms the expected access works.' },
          { label: 'Keep adding permissions until access is restored.', feedback: 'Repeated broad changes can create excessive access. Verify the approved change first and stop once the user can do their task.' },
          { label: 'Ask the user to test, confirm the result, and document the change.', feedback: 'That closes the loop: verify the outcome with the user and document the approved change and result for the support record.' }
        ]
      }
    ]
  },
  'network-connection': {
    label: 'CASE 02 / CONNECTIVITY',
    title: 'A computer cannot connect to the network.',
    context: 'One employee reports that websites will not load. A nearby colleague’s connection appears normal.',
    steps: [
      {
        prompt: 'Which low-risk check helps narrow down the problem first?',
        correct: 1,
        choices: [
          { label: 'Restart network equipment for the entire office.', feedback: 'That could disrupt many people. First find out whether this is limited to one computer, one connection type, or a larger area.' },
          { label: 'Check the connection state and compare with another known-working device.', feedback: 'Good first check. Compare scope, connection state, and any visible error before changing settings. This helps distinguish a device issue from a wider outage.' },
          { label: 'Disable all security software on the computer.', feedback: 'Disabling protections is not a safe diagnostic shortcut. Gather basic connection evidence before considering any approved change.' }
        ]
      },
      {
        prompt: 'The computer is connected to Wi-Fi, but its network settings look unusual. What next?',
        correct: 0,
        choices: [
          { label: 'Record the address and gateway details, then compare them with a working device or approved configuration.', feedback: 'Right. Compare the device’s address, gateway, and DNS configuration with a working example or the expected setup before proposing a change.' },
          { label: 'Guess a new IP address until browsing starts.', feedback: 'Guessing can cause address conflicts and make the issue harder to diagnose. Check the expected addressing method and current settings first.' },
          { label: 'Delete the network configuration and reinstall the operating system.', feedback: 'That is a high-impact response without enough evidence. Use the current settings and the scope of the problem to guide a targeted next step.' }
        ]
      },
      {
        prompt: 'A permitted connectivity test responds, but one site name does not resolve. What does that suggest?',
        correct: 2,
        choices: [
          { label: 'Immediately replace the network adapter.', feedback: 'A responding connectivity test suggests the adapter can communicate. Check the name-resolution path before replacing hardware.' },
          { label: 'Assume every internet service is down.', feedback: 'One failed site name does not prove a total outage. Compare another approved destination and investigate name resolution.' },
          { label: 'Investigate DNS resolution and verify the result with another approved test.', feedback: 'That is a focused next step. DNS translates names to addresses, so check name resolution and record what a comparison test shows.' }
        ]
      }
    ]
  },
  'forgotten-password': {
    label: 'CASE 03 / ACCOUNT ACCESS',
    title: 'A user has forgotten their password.',
    context: 'The employee cannot sign in and asks for help regaining access to their account.',
    steps: [
      {
        prompt: 'What should happen before any password reset?',
        correct: 2,
        choices: [
          { label: 'Ask the user to send their current password by email.', feedback: 'Never request or share passwords. A password is sensitive authentication information.' },
          { label: 'Reset the password immediately based only on the request.', feedback: 'A reset without identity verification could give the wrong person access. Follow the organization’s approved account recovery process.' },
          { label: 'Verify the user’s identity using the approved recovery procedure.', feedback: 'Correct. Use the established identity-verification process before taking action on an account.' }
        ]
      },
      {
        prompt: 'Identity has been verified. What is the safer recovery approach?',
        correct: 1,
        choices: [
          { label: 'Set one shared temporary password for the whole team.', feedback: 'Shared credentials remove individual accountability and expose multiple accounts. Use the approved recovery workflow for this user.' },
          { label: 'Use the authorized reset process and require a private, unique replacement.', feedback: 'Good. Make only the authorized account change, use the approved recovery method, and ensure the user can choose a unique secret privately.' },
          { label: 'Disable account protections so the user can sign in faster.', feedback: 'Removing protections is not a safe recovery method. Restore access through the approved reset process without weakening account security.' }
        ]
      },
      {
        prompt: 'The user can sign in again. What is a good final step?',
        correct: 0,
        choices: [
          { label: 'Confirm access, remind them not to share credentials, and document the recovery.', feedback: 'Exactly. Confirm the user can sign in, reinforce safe credential handling, and record the recovery without recording the password.' },
          { label: 'Write the new password in the support notes for next time.', feedback: 'Never store a user’s password in support notes. Document the action and outcome—not the secret.' },
          { label: 'Leave the recovery request open indefinitely.', feedback: 'Confirm the outcome and document the completed authorized action, then follow normal case closure steps.' }
        ]
      }
    ]
  }
};

const scenarioButtons = [...document.querySelectorAll('.scenario-button')];
const scenarioLabel = document.querySelector('#scenario-label');
const scenarioTitle = document.querySelector('#scenario-title');
const scenarioContext = document.querySelector('#scenario-context');
const scenarioPrompt = document.querySelector('#scenario-prompt');
const scenarioChoices = document.querySelector('#scenario-choices');
const scenarioFeedback = document.querySelector('#scenario-feedback');
const stepCount = document.querySelector('#lab-step-count');
const nextStepButton = document.querySelector('#next-step');
const restartButton = document.querySelector('#restart-scenario');

let activeScenario = 'shared-folder';
let activeStep = 0;
let answeredCorrectly = false;

function renderScenario() {
  const scenario = scenarios[activeScenario];
  const step = scenario.steps[activeStep];

  scenarioLabel.textContent = scenario.label;
  scenarioTitle.textContent = scenario.title;
  scenarioContext.textContent = scenario.context;
  scenarioPrompt.textContent = step.prompt;
  stepCount.textContent = `STEP ${String(activeStep + 1).padStart(2, '0')} / ${String(scenario.steps.length).padStart(2, '0')}`;
  scenarioFeedback.textContent = 'Choose an action to see what the evidence suggests.';
  scenarioFeedback.className = 'feedback-message';
  nextStepButton.hidden = true;
  restartButton.hidden = true;
  answeredCorrectly = false;
  scenarioChoices.replaceChildren();

  step.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice-button';
    button.textContent = choice.label;
    button.addEventListener('click', () => selectChoice(index));
    scenarioChoices.append(button);
  });
}

function selectChoice(choiceIndex) {
  if (answeredCorrectly) return;

  const scenario = scenarios[activeScenario];
  const step = scenario.steps[activeStep];
  const isCorrect = choiceIndex === step.correct;
  scenarioFeedback.textContent = step.choices[choiceIndex].feedback;
  scenarioFeedback.className = `feedback-message ${isCorrect ? 'feedback-good' : 'feedback-retry'}`;

  if (!isCorrect) return;

  answeredCorrectly = true;
  scenarioChoices.querySelectorAll('button').forEach(button => {
    button.disabled = true;
  });

  if (activeStep === scenario.steps.length - 1) {
    scenarioFeedback.textContent += ' Scenario complete. Select another case or try this one again.';
    restartButton.hidden = false;
  } else {
    nextStepButton.textContent = 'Continue to the next check →';
    nextStepButton.hidden = false;
  }
}

scenarioButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeScenario = button.dataset.scenario;
    activeStep = 0;
    scenarioButtons.forEach(scenarioButton => {
      const isActive = scenarioButton === button;
      scenarioButton.classList.toggle('active', isActive);
      scenarioButton.setAttribute('aria-pressed', String(isActive));
    });
    renderScenario();
  });
});

nextStepButton.addEventListener('click', () => {
  activeStep += 1;
  renderScenario();
  scenarioPrompt.focus();
});

restartButton.addEventListener('click', () => {
  activeStep = 0;
  renderScenario();
});

renderScenario();
document.querySelector('#year').textContent = new Date().getFullYear();
