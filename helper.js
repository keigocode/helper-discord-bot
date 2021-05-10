const { Client, MessageAttachment, MessageEmbed, MessageReaction} = require('discord.js');
const cliente = new Client({disableEveryone: true});
const path = require('path');

function embed(title, description, color){
	const message = new MessageEmbed();
	message.setTitle(title ? title : "");
	message.setDescription(description ? description : "");
	message.setColor(color ? color : 0x2f3136);
	return message;
}

class event {
	constructor(message, options){
		this.message = message;
		this.options = options;
	}
	command(comando, func){
		const inicia = this.message.content.split(' ', 1)[0];
		const prefix = this.options ? this.options : "!";
		if(inicia == `${prefix}${comando}`){
			func(new msg(this.message));
		}
	}
}

class msg {
	constructor(message){
		this.message = message;
	}
	send(message){
		this.message.channel.send(message)
	}
	reply(message){
		this.message.reply(message);
	}
	private(message){
		const member = this.message.member;
		member.send(message)
	}
	mention(func){
		const mention = this.message.mentions.users.first();
		return mention;
	}
	verify(member, func, func2){
		if(!member) return;
		if(this.message.guild.member(member)){
			func(member)
		}else {
			return undefined;
		}
	}
	user(member){
		return `<@!${member.id}>`
	}
	delete(){
		this.message.delete();
	}
	content(run){
		if(run){
			return this.message.content.slice(run);
		}else {
			return this.message.content;
		}
	}
	start(){
		return this.message.content.split(' ', 1)[0];
	}
	perms(perm, func, func2){
		const perms = this.message.member.hasPermission(perm);
		if(perms) {
			return true;
		}else {
			return undefined;
		}
	}
	sendIf(boolean, msg1, msg2){
		if(boolean == true){
			return this.send(msg1);
		}else {
			if(msg2){
				return this.send(msg2);
			}
		}
	}
}

const status = function(comp){
	return new Promise((req, res) => {
		if(comp){
			res(comp)
		}else {
			req(new Error('No'))
		}
	});
}

class helper {
	constructor(options, database){
		this.options = options;
		this.database = database;
	}
	login(token){
		cliente.login(token);
	}
	presence(description){
		cliente.on('ready', () => {
			console.log(`El bot esta encendido en los servidores ${cliente.user.tag}`);
		  cliente.user.setActivity({
		    "status": "IDLE",
		    "name": description ? description : "Con helper-bots",
		  });
			console.log(cliente.user.presence.status);
		});
	}
	command(comando, func){
		cliente.on('message', (message) => {
			const botinterrogative = message.author;
		  if(!botinterrogative) return;
		  if(botinterrogative.bot == true) return;
		  if(!message.guild) return;
		  const footer = {text: message.author.tag, icon: message.author.avatarURL()}
		  const inicia = message.content.split(' ', 1)[0];
		  const prefix = this.options ? this.options : "!";
		  if(inicia == `${prefix}${comando}`){
		  	func(new msg(message), message)
		  }
		})
	}
	mention(func){
		cliente.on('message', (message) => {
			const botinterrogative = message.author;
		  if(!botinterrogative) return;
		  if(botinterrogative.bot == true) return;
		  if(!message.guild) return;
		  const footer = {text: message.author.tag, icon: message.author.avatarURL()}
		  const inicia = message.content.split(' ', 1)[0];
		  if(inicia == `<@!${cliente.user.id}>`){
		  	func(new msg(message), message)
		  }
		})
	}
	message(func){
		cliente.on('message', message => {
			const botinterrogative = message.author;
		  if(!botinterrogative) return;
		  if(botinterrogative.bot == true) return;
		  if(!message.guild) return;
		  const prefix = this.options ? this.options : "!";
		  func(new event(message, prefix), message)
		})
	}
}

function bot(){
	return new helper();
}

module.exports = {bot, embed, status};
