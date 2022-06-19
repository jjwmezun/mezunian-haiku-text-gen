const fs = require(`fs`);

const getTypeFromExt = (ext) => {
    switch (ext) {
        case (`mp3`): return `mpeg`;
        default: return ext;
    }
};

const getBackupSong = (songs) => {
    for (const song of songs) {
        if (song.ext === `mp3`) {
            return song;
        }
    }
    return songs[0];
};

const render = (text, songs, mediaId) => {
return `${ songs.length > 0 ? `<figure class="mezun-center">
    <figcaption><b>Accompanying music:</b></figcaption>
    <audio controls>
        ${
            songs.map(song => `<source src="${song.file}" type="audio/${getTypeFromExt(song.ext)}">`).join(`\n\t`)
        }
    <p>Your browser doesn't support HTML5 audio. Here is a <a href="${getBackupSong(songs).file}">link to the audio</a> instead.</p>
    </audio>
</figure>\n\n` : `` }<div class="mezun-verse mezun-haiku">
    ${
        text.map(ln => `<p>${ln}</p>`).join(`\n    `)
    }
</div>${ mediaId ? `\n\n<figure>[upload-image media-id="${mediaId}" class="mezun-post-img"]</figure>` : `` }`;
}

const dataDir = `data`;

fs.readdir(dataDir, (err, files) => {
    if (err) {
        throw err;
    }
    files.forEach(file => {
        fs.readFile(`${dataDir}/${file}`, (err, data) => {
            if (err) {
                throw err;
            }
            const parts = data.toString().split(`\n\n`);
            const text = parts[0].split(`\n`);
            const songs = parts.length > 1 ? parts[1].split(`\n`).map(file => { return {file: file, ext: file.split(`.`).pop()}; }) : [];
            const mediaId = parts.length > 2 ? parseInt(parts[2]) : null;
            const out = render(text, songs, mediaId);
            fs.writeFile(`out/${file}`, out, err => {
                if (err) {
                    throw err;
                }
            });
        });
    });
});