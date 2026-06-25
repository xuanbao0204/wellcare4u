let audio: HTMLAudioElement | null = null;

export const playNotificationSound =
    () => {

        try {

            if (!audio) {

                audio =
                    new Audio(
                        "/sounds/notiSound.mp3"
                    );

                audio.volume = 0.55;
            }

            audio.currentTime = 0;

            void audio.play();

        } catch (e) {

            console.error(
                "[Sound]",
                e
            );
        }
    };