const IHLCommand = require('../../lib/ihlCommand');

/**
 * @class LobbyKillCommand
 * @extends IHLCommand
 */
module.exports = class LobbyKillCommand extends IHLCommand {
    constructor(client) {
        super(client, {
            name: 'lobby-kill',
            aliases: ['lobby-destroy'],
            group: 'admin',
            memberName: 'lobby-kill',
            guildOnly: true,
            description: 'Kill a lobby.',
        }, {
            inhouseAdmin: true,
            inhouseState: true,
            lobbyState: true,
            inhouseUser: false,
        });
    }

    async onMsg({ msg, inhouseState, lobbyState }) {
        this.ihlManager.emit(CONSTANTS.EVENT_LOBBY_KILL, lobbyState, inhouseState);
    }
};
