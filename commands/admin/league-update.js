const { Command } = require('discord.js-commando');
const {
    ihlManager, isMessageFromAnyInhouseAdmin,
} = require('../../lib/ihlManager');
const {
    findLeague, updateLeague,
} = require('../../lib/db');
const db = require('../../models');

const validLeagueAttributes = Object.keys(db.League.attributes).filter(key => !db.League.attributes[key]._autoGenerated);
const settingMap = {};

validLeagueAttributes.forEach(a => {
    settingMap[a.replace(/_/g, '')] = a;
})

/**
 * @class LeagueUpdateCommand
 * @extends external:Command
 */
class LeagueUpdateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'league-update',
            group: 'admin',
            memberName: 'league-update',
            guildOnly: true,
            description: 'Update an inhouse league setting.',
            args: [
                {
                    key: 'setting',
                    prompt: `Provide a league setting. (${Object.keys(settingMap).join(', ')})`,
                    type: 'string',
                    validate: (setting) => {
                        if (LeagueUpdateCommand.isValidSetting(setting)) return true;
                        return `Setting must be one of ${Object.keys(settingMap).join(', ')}`;
                    },
                },
                {
                    key: 'value',
                    prompt: 'Provide a value for the league setting.',
                    type: 'string',
                    validate: value => (value ? true : 'Must provide a setting value.'),
                },
            ],
        });
    }
    
    static get settingMap(){
        return settingMap;
    }

    static isValidSetting(setting) {
        return Object.keys(settingMap).indexOf(setting.toLowerCase().replace(/_/g, '')) !== -1;
    }

    hasPermission(msg) {
        return isMessageFromAnyInhouseAdmin(ihlManager.inhouseStates, msg);
    }

    async run(msg, { setting, value }) {
        const field = settingMap[setting];
        const guild = msg.channel.guild;
        await updateLeague(guild.id)({ [field]: value });
        await msg.say(`League setting updated. ${setting} set to ${value}`);
    }
}

LeagueUpdateCommand.settingMap = settingMap;

module.exports = LeagueUpdateCommand;
