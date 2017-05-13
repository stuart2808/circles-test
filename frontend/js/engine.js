var engine = {

	width: 0,
	height : 0,
	circles_obj : {},
	mousedown : false,


	initialise : function()
	{
		var self = this;
		var c = document.getElementById('canvas');
		var context = c.getContext('2d');
	
		self.context = context;
		self.width = context.canvas.width;
		self.height = context.canvas.height;

		 var moving_circle;

		function add_element(e)
		{
			self.addElement(e.offsetX, e.offsetY);
		}

		c.onmousemove = function(m)
		{
			if(moving_circle != undefined)
			{
				self.circles_obj[moving_circle]['xPos'] = m.offsetX;
				self.circles_obj[moving_circle]['yPos'] = m.offsetY;
				self.update_frame();
			}
		}

		c.onmouseup = function(u)
		{
			if(moving_circle != undefined)
			{
				self.collision_check(moving_circle);
				moving_circle = undefined;
			}
		}

		c.onmousedown = function(d)
		{	
			self.mousedown = true;
			c.addEventListener('click', add_element);	
			Object.keys(self.circles_obj).forEach(function(v)
			{
				if((d.offsetX>=self.circles_obj[v].xPos-self.circles_obj[v].radX && d.offsetX<=self.circles_obj[v].xPos+self.circles_obj[v].radX ) && (d.offsetY>=self.circles_obj[v].yPos-self.circles_obj[v].radY && d.offsetY <= self.circles_obj[v].yPos+self.circles_obj[v].radY))
				{
					moving_circle = v;
					c.removeEventListener('click', add_element);
				}
			});
		}
		//self.start_loop();
	},

	collision_check : function(circle1)
	{
		var self = this;
		var collision = false;

		Object.keys(self.circles_obj).forEach(function(circle2)
		{
			if (circle1 == circle2) return;
			var cx = self.circles_obj[circle1].xPos - self.circles_obj[circle2].xPos;
			var cy = self.circles_obj[circle1].yPos - self.circles_obj[circle2].yPos;
			var distance = Math.sqrt(cx * cx + cy * cy);
			if (distance < self.circles_obj[circle1].radX + self.circles_obj[circle2].radY)
			{
				collision = true;
				if(self.circles_obj[circle1].xPos > self.circles_obj[circle2].xPos)
				{
					self.circles_obj[circle1].xPos = self.circles_obj[circle1].xPos+2;
					self.circles_obj[circle2].xPos = self.circles_obj[circle2].xPos-2;
				} else if(self.circles_obj[circle1].xPos < self.circles_obj[circle2].xPos) {
					self.circles_obj[circle1].xPos = self.circles_obj[circle1].xPos-2;
					self.circles_obj[circle1].xPos = self.circles_obj[circle1].xPos+2;
				}

				if(self.circles_obj[circle1].yPos > self.circles_obj[circle2].yPos)
				{
					self.circles_obj[circle1].yPos = self.circles_obj[circle1].yPos+2;
					self.circles_obj[circle2].yPos = self.circles_obj[circle2].yPos-2;
				} else if(self.circles_obj[circle1].yPos < self.circles_obj[circle2].yPos) {
					self.circles_obj[circle1].yPos = self.circles_obj[circle1].yPos-2;
					self.circles_obj[circle2].yPos = self.circles_obj[circle2].yPos+2;
				}
			}
			
		});
		
		if(collision) 
			{
				//move off the stack so you can see the animation
				setTimeout(function(){ 
					self.update_frame();
					self.collision_check(circle1);
				}, 0);
			}
		
	},

	update_frame : function()
	{
		var self = this;
		self.context.save();
		self.context.clearRect(0, 0, self.width, self.height);

		Object.keys(self.circles_obj).forEach(function(v){
			self.context.beginPath();
			self.context.ellipse(self.circles_obj[v].xPos, self.circles_obj[v].yPos, self.circles_obj[v].radX, self.circles_obj[v].radY, self.circles_obj[v].rotation, self.circles_obj[v].startAngle, self.circles_obj[v].endAngle);
			self.context.closePath();
			self.context.fillStyle = self.circles_obj[v].colour;
			self.context.fill();
			self.context.strokeStyle = 'black';
			self.context.lineWidth = 2;
			self.context.stroke();
			self.context.textAlign = 'center';
			self.context.fillStyle = self.circles_obj[v].textColour;
			self.context.fillText(self.circles_obj[v].name, self.circles_obj[v].xPos, self.circles_obj[v].yPos);
		});

		self.context.restore();
	},

	start_loop : function() {
		var self = this;
	    var raf_func = function(message)
		{				
			self.update_frame();
			requestAnimationFrame(raf_func);
		};

		raf_func();
	},

	addElement : function(xPos, yPos, radX=50, radY=50, rotation=0, startAngle=0, endAngle= 2 * Math.PI, colour='random')
	{
		var self = this;

		var now = new Date();

		if(colour == 'random') colour = '#'+Math.floor(Math.random()*16777215).toString(16);

		var circleNo = Object.keys(self.circles_obj).length + 1;
		var circle_details = {
			'name' : 'circle'+ circleNo,
			'moving' : false,
			'prevXPos' : xPos,
			'prevYPos' : yPos,
			'xPos' : xPos,
			'yPos' : yPos,
			'radX' : radX,
			'radY' : radY,
			'rotation' : rotation,
			'startAngle' : startAngle,
			'endAngle' : endAngle,
			'colour' : colour,
			'textColour' : 'black'
		}

		var key = Number(new Date());
		//using date and time as a unique(ish) key for the object
		self.circles_obj[key] = circle_details;
		self.update_frame();
		self.collision_check(key);

	},

	return_layout : function()
	{
		var self = this;
		return self.circles_obj;
	},


	add_layout : function(layout)
	{
		var self = this;
		self.circles_obj = layout;
		self.update_frame();
	},

	reset_layout : function()
	{
		var self = this;
		self.circles_obj = {};
		self.update_frame();
	}


}