#ARQUIVO DE CONTROLE


from __future__ import print_function
from flask import *
from flaskext.mysql import MySQL
import sys
from data_base_manager import *
from modelo import *



app = Flask(__name__)


# incializacao da base de dados ----------------------------------------------------------------------

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'trabalho'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)
conn = mysql.connect()

db_master = DatabaseMaster(conn)
#-------------------------------------------------------------------------------------------------------


@app.route('/', methods = ['GET', 'POST'])
def index():
    name = request.cookies.get('username')
    if name != None and name != 'null':
        return render_template("logged.html",name = name)
    
    else:
        return render_template("/index.html")


@app.route("/login", methods = ['GET', 'POST'])
def login():

	name = request.form["username"]
	senha = request.form["pass"]
	username = []
	password = []
	logado = 0

	logado = db_master.login(name, senha)
	if logado == 1:
		resp = make_response(render_template("logged.html",name = name))
		resp.set_cookie('username', name)
		return resp

	else:
		return render_template("cadastra.html")



@app.route('/formulario')
def formulario():
	return render_template("cadastra.html")

@app.route("/cadastrado", methods = ['GET', 'POST'])
def cadastrado():
	username = request.form['nomeDoUsuario']
	password = request.form['senhaDoUsuario']
	inserido = db_master.insereUser(username, password)

		

	return render_template("index.html")


@app.route('/getProf', methods=['POST'])
def getProf():
	data = request.get_json()
	print(data["professor"], file=sys.stdout)
	professor = data["professor"]
	return (db_master.getComentariosProf(professor))

@app.route('/getAulas', methods=['POST'])
def getAulas():
	data = request.get_json()
	print(data["dre"], file=sys.stdout)
	dre = data["dre"]
	return (db_master.getAulasComDre(dre))

@app.route('/getMateriais', methods=['POST'])
def getMateriais():
	data = request.get_json()
	print(data["disciplina"], file=sys.stdout)
	disciplina = data["disciplina"]
	return (db_master.getMateriais(disciplina))

@app.route('/getComentariosDisciplina', methods=['POST'])
def getComentariosDisciplina():
	data = request.get_json()
	print(data["disciplina"], file=sys.stdout)
	disciplina = data["disciplina"]
	return (db_master.getComentariosDisciplina(disciplina))



@app.route('/sendComentario', methods=['POST'])
def sendComentario():
	data = request.get_json()
	print(data, file=sys.stdout)
	disciplina = data["professor"]
	comentario = data['comentario']
	return (db_master.sendComentario(disciplina, comentario))

@app.route('/sendComentarioDisciplina', methods=['POST'])
def sendComentarioDisciplina():
	data = request.get_json()
	print(data, file=sys.stdout)
	disciplina = data["disciplina"]
	comentario = data['comentario']
	return (db_master.sendComentarioDisciplina(disciplina, comentario))



@app.route('/sendAula', methods=['POST'])
def sendAula():
	data = request.get_json()
	print(data, file=sys.stdout)
	nome = data["nome"]
	professor = data['professor']
	dre = data['dre']
	creditos = data['creditos']
	horario = data['horario']
	return (db_master.sendAula(nome, professor, dre, creditos, horario))


@app.route('/sendMaterial', methods=['POST'])
def sendMaterial():
	data = request.get_json()
	print(data, file=sys.stdout)
	disciplina = data["disciplina"]
	link = data['link']
	tipo = data['tipo']

	return (db_master.sendMaterial(disciplina, link, tipo))

@app.route('/deleteAula', methods=['POST'])
def delteAula():
	data = request.get_json()
	print(data, file=sys.stdout)
	disciplina = data["disciplina"]
	dre = data['dre']

	return (db_master.deleteAula(disciplina, dre))

@app.route('/getProfessores', methods=['POST'])
def getProfessores():
	data = request.get_json()
	print(data, file=sys.stdout)
	return (db_master.getProfessores())


@app.route('/getDisciplinas', methods=['POST'])
def getDisciplinas():
	data = request.get_json()
	print(data, file=sys.stdout)
	return (db_master.getDisciplinas())



@app.route('/fechaConexao', methods=['POST'])
def fechaConexao():
	data = request.get_json()
	print(data, file=sys.stdout)
	db_master.conn.close()
	return (jsonify({'conexao':'fechada'}))




app.run()