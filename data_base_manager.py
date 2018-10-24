#MODELO DA APLICACAO


from __future__ import print_function
from flask import *
from flaskext.mysql import MySQL
import sys
from modelo import *


'''

Classe que faz as interacoes com o banco de dados --> realiza consultas e insercoes

'''
class DatabaseMaster(): 
	def __init__(self, conn):
		self.conn = conn #From a logical point of view, a cursor is a pointer to a row returned by a query, implemented on database side.
	def login(self,nomeDoAluno, senha):
		cursor = self.conn.cursor() #cursor 
		sql = "SELECT * FROM aluno WHERE dre = '" + nomeDoAluno + "' and senha = '"+senha+"';" # comando sql => tbm chamado de query	
		cursor.execute(sql) #executa o comando sql fazendo o cursor 'apontar' para a primeira de variais rows 
		valores = cursor.fetchone() # a funcao fetch traz os dados para quais o cursor aponta
		if valores == None:
			return 0
		else:
			return 1
		cursor.close()

	def insereUser(self, username, senha):
		cursor = self.conn.cursor()
		sql = "SELECT * FROM aluno WHERE dre = '" + username + "' and senha = '"+senha+"';"	
		cursor.execute(sql)
		valores = cursor.fetchone()
		if valores == None:
			existe = 0
		else:
			existe = 1

		if existe == 0:
			sql = "INSERT INTO aluno (dre, senha) VALUES ('"+username+"', '"+senha+"');"
			cursor.execute(sql)
			self.conn.commit()
			cursor.close()
			return 'true'


	def getUserByName(self,nomeDoAluno):
		cursor = self.conn.cursor()
		sql = "SELECT * FROM aluno WHERE nome = '" + nomeDoAluno + "'"	
		cursor.execute(sql)
		valores = cursor.fetchone()
		cursor.close()
		print(valores , file=sys.stdout)

	def getComentariosProf(self,nomeProfessor):
		cursor = self.conn.cursor()
		comentarios = []
		sql = "SELECT * FROM comentarios_prof WHERE professor = '" + nomeProfessor + "'"	
		cursor.execute(sql)
		valores = cursor.fetchone()
		comment = ComentarioProf(valores[1], nomeProfessor)
		comentarios.append(comment.serialize())
		while valores != None:
			valores = cursor.fetchone()
			if valores != None:
				comment = ComentarioProf(valores[1], nomeProfessor)
				comentarios.append(comment.serialize())

		print(comentarios, file=sys.stdout)
		cursor.close()
		return jsonify(comentarios)

	
	def getComentariosDisciplina(self,disciplina):
		cursor = self.conn.cursor()
		comentarios = []
		sql = "SELECT * FROM comentarios_disciplina WHERE disciplina = '" + disciplina + "'"	
		cursor.execute(sql)
		valores = cursor.fetchone()
		comment = ComentarioDisciplina(valores[1], disciplina)
		comentarios.append(comment.serialize())
		while valores != None:
			valores = cursor.fetchone()
			if valores != None:
				comment = ComentarioDisciplina(valores[1], disciplina)
				comentarios.append(comment.serialize())

		print(comentarios, file=sys.stdout)
		cursor.close()
		return jsonify(comentarios)
	
	
	def sendComentario(self, professor, comentario):
		cursor = self.conn.cursor()
		sql = "INSERT INTO comentarios_prof (professor, comentario) VALUES ('"+professor+"', '"+comentario+"');"
		cursor.execute(sql)
		self.conn.commit()
		return "true"

	def sendComentarioDisciplina(self, disciplina, comentario):
		cursor = self.conn.cursor()
		sql = "INSERT INTO comentarios_disciplina (disciplina, comentario) VALUES ('"+disciplina+"', '"+comentario+"');"
		cursor.execute(sql)
		self.conn.commit()
		cursor.close()
		return "true"
	

		
	def getAulasComDre(self, dre):
		cursor = self.conn.cursor()
		aulas = []
		sql = "SELECT * FROM aulas WHERE dre = '" + dre + "'"	
		try:
			cursor.execute(sql)
			valores = cursor.fetchone()
			aula = Aula(valores[0],valores[1],valores[2],valores[3],valores[4])
			aulas.append(aula.serialize())
			while valores != None:
				valores = cursor.fetchone()
				if valores != None:
					aula = Aula(valores[0],valores[1],valores[2],valores[3],valores[4])
					aulas.append(aula.serialize())

			print(aulas, file=sys.stdout)
			cursor.close()
			return jsonify(aulas)			
		except Exception as e:
			cursor.close()
			print(e, file=sys.stdout)
			return jsonify({'reposta': 'erro'})


	def sendAula(self, nome, professor, dre, creditos, horario):
		cursor = self.conn.cursor()
		sql = "INSERT INTO aulas (nome, professor, dre, creditos, horario) VALUES ('"+nome+"', '"+professor+"', '"+dre+"', '"+creditos+"' , '"+horario+"');"
		cursor.execute(sql)
		self.conn.commit()
		cursor.close()
		return "true"

	def getMateriais(self, disciplina):
		cursor = self.conn.cursor()
		materiais = []
		sql = "SELECT * FROM materiais WHERE disciplina = '" + disciplina + "'"	
		cursor.execute(sql)
		valores = cursor.fetchone()
		material = Material(valores[0],valores[1],valores[2])
		materiais.append(material.serialize())
		while valores != None:
			valores = cursor.fetchone()
			if valores != None:
				material = Material(valores[0],valores[1],valores[2])
				materiais.append(material.serialize())

		print(materiais, file=sys.stdout)
		cursor.close()
		return jsonify(materiais)
	
	def sendMaterial(self, disciplina, link, tipo):
		cursor = self.conn.cursor()
		sql = "INSERT INTO materiais (disciplina, link, tipo) VALUES ('"+disciplina+"', '"+link+"', '"+tipo+"');"
		cursor.execute(sql)
		self.conn.commit()
		cursor.close()
		return "true"

	def deleteAula(self, disciplina, dre):
		cursor = self.conn.cursor()
		sql = "DELETE from aulas where dre='"+dre+"' and nome ='"+disciplina+"'"
		print(sql , file=sys.stdout)
		cursor.execute(sql)
		self.conn.commit()
		cursor.close()
		return "true"
	
	def getProfessores(self):
		cursor = self.conn.cursor()
		try:
			professores = []
			sql = "SELECT * FROM professores"	
			cursor.execute(sql)
			valores = cursor.fetchone()
			prof = Professor(valores[0],valores[1],valores[2])
			professores.append(prof.serialize())
			while valores != None:
				valores = cursor.fetchone()
				if valores != None:
					prof = Professor(valores[0],valores[1],valores[2])
					professores.append(prof.serialize())

			print(professores, file=sys.stdout)
			
			cursor.close()
			return jsonify(professores)

		except Exception as e:
			cursor.close()
			print(e, file=sys.stdout)
			return jsonify({'reposta': 'erro'})


	def getDisciplinas(self):
		cursor = self.conn.cursor()
		try:
			disciplinas = []
			sql = "SELECT * FROM disciplinas"	
			cursor.execute(sql)
			valores = cursor.fetchone()
			disc = Disciplina(valores[0])
			disciplinas.append(disc.serialize())
			while valores != None:
				valores = cursor.fetchone()
				if valores != None:
					disc = Disciplina(valores[0])
					disciplinas.append(disc.serialize())

			print(disciplinas, file=sys.stdout)
			
			cursor.close()
			return jsonify(disciplinas)

		except Exception as e:
			cursor.close()
			print(e, file=sys.stdout)
			return jsonify({'reposta': 'erro'})

