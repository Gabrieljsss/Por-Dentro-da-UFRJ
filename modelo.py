'''
Classe do modelo
'''

class Pessoa():
	def __init__(self, nome):
		self.nome = nome

class Comentario():
	def __init__(self, texto):
		self.texto = texto



class Aluno(Pessoa):
	def __init__(self, dre, senha):
		Pessoa.__init__(self, dre)
		self.dre = self.nome #dre esta sendo tratado como username
		self.senha = senha

	def serialize(self):
		return {'dre' : self.dre, 'senha': self.senha}

class ComentarioProf(Comentario):
	def __init__ (self, texto, professor):
		Comentario.__init__(self,texto)
		self.professor = professor
	def serialize(self):
		return {'comentario' : self.texto, 'professor': self.professor}

class ComentarioDisciplina(Comentario):
	def __init__(self, texto, disciplina):
		Comentario.__init__(self, texto)
		self.disciplina = disciplina
	def serialize(self):
		return {'comentario' : self.texto, 'disciplina': self.disciplina}

class Aula():
	def __init__ (self, nome, professor, dre, creditos, horario):
		self.nome = nome
		self.professor = professor
		self.dre = dre
		self.creditos = creditos
		self.horario = horario
	def serialize(self):
		return {'nome' : self.nome, 'professor': self.professor, 'dre': self.dre,'creditos': self.creditos, 'horario': self.horario}

class Material():
	def __init__ (self, disciplina, link, tipo):
		self.disciplina = disciplina
		self.link = link
		self.tipo = tipo
	def serialize(self):
		return {'disciplina' : self.disciplina, 'link': self.link, 'tipo': self.tipo}

class Professor(Pessoa):
	def __init__ (self, nome, ciac, dpto):
		Pessoa.__init__(self, nome)
		self.ciac = ciac
		self.dpto = dpto
	def serialize(self):
		return {'nome' : self.nome, 'ciac': self.ciac, 'dpto': self.dpto}
class Disciplina():
	def __init__(self, nome):
		self.nome = nome
	def serialize(self):
		return {'nome' : self.nome}


	


		