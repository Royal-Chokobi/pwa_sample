'use strict';

let deferredInstallPrompt = null;
const installButton = document.getElementById('butInstall');
installButton.addEventListener('click', installPWA);

// CODELAB: Add event listener for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 *
 * @param {Event} evt
 */
function saveBeforeInstallPromptEvent(evt) {

    // CODELAB: Add code to save event & show the install button.
    console.log("before install!!!!", evt);
    evt.preventDefault();
    deferredInstallPrompt = evt;
  //  console.log(deferredInstallPrompt)
    installButton.removeAttribute('hidden');
}


/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */
function installPWA(evt) {
    // CODELAB: Add code show install prompt & hide the install button.
    console.log("install Btn click!!!", evt);
    deferredInstallPrompt.prompt();
    //evt.srcElement.setAttribute('hidden', true);
    installButton.setAttribute('hidden', true)
    // CODELAB: Log user response to prompt.

}

// CODELAB: Add event listener for appinstalled event
window.addEventListener('appinstalled', logAppInstalled);

/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 *
 * @param {Event} evt
 */
function logAppInstalled(evt) {
    // CODELAB: Add code to log the event

    evt.preventDefault();
    deferredInstallPrompt = evt;

    deferredInstallPrompt.userChoice
        .then((choice) => {
            if (choice.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt', choice);
            } else {
                console.log('User dismissed the A2HS prompt', choice);
            }
            deferredInstallPrompt = null;
        });
    console.log("Wow!! already install!!!!!!", evt);

}
